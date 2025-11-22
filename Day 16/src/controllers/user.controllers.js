import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import { subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"

const generateRefreshTokenAndAccessToken = async (userID) => {
    try {
        const USER = await user.findById(userID)

        const accessToken = USER.generateAccessToken()
        const refreshToken = USER.generateRefreshToken()

        USER.refreshToken = refreshToken
        await USER.save({validateBeforeSave: false}) //not validate anything so it direct save

        return {accessToken , refreshToken}
        
    } catch (error) {
        throw new apiError(500 , "something went wrong while generating refreshToken and accessToken")
    }
}

const registerUser = asyncHandler( async (req , res) => {
   const {username, fullname, email, password} = req.body
//    console.log("email : " , email);

   if( [username, fullname, email, password].some((e) => e.trim() == "" ) ) {
        throw new apiError(400 , "All fields are required")
   }

  const userExisted = await user.findOne({
    $or: [ {username} , {email} ] //That $or operator in MongoDB (and Mongoose) is used to check multiple conditions, and it returns a document if any one of them is true
   })

   if(userExisted){
    throw new apiError(409, "user with email or username already exists")
   }

   console.log(req.files);
   

   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path

   
    console.log("Avatar path:", avatarLocalPath); // Debug log
    console.log("Cover image path:", coverImageLocalPath); // Debug log
   

   if(!avatarLocalPath){
    throw new apiError(400 , "avatar is required")
   }
   
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null
    
   
    if(!avatar){
     throw new apiError(400 , "avatar file is required")   
    }

    const userCreated = await user.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar : avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await user.findById(userCreated._id).select("-password -refreshToken")  //.select() to exclude some fields from the result

    if(!createdUser){
        throw new apiError(500 , "something went wrong while registering user")  
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "user registered successfully")
    )
   
   
})

const loginUser = asyncHandler( async (req , res) => {
   //req body -> data
   //username & email
   //find the user
   //password check
   //access token & refresh token 
   //send cookie

   const {username, email, password} = req.body

   if(!username && !email){
    throw new apiError(400 , "username or email is required");
   }


   const userExist = await user.findOne( { $or: [{email},{username}] } ) //email or username

   if(!userExist){
    throw new apiError(400 , "user does not existed!")
   }

    const isPasswordValid = await userExist.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(400 , "password is incorrect!");
    }

    const {accessToken , refreshToken} = await generateRefreshTokenAndAccessToken(userExist._id)

    const loggedInUser = await user.findById(userExist._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,  // Prevents client-side JS access (XSS protection)
        secure: true // Only works on HTTPS
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken , options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
        )
    )




})

const logoutUser = asyncHandler( async (req , res) => {
    await user.findByIdAndUpdate(req.user._id, 
        {
            $unset : {
                refreshToken: 1, // This removes the field from document
            }
        },
        {
            new: true
        }
     )

    const options = {
        httpOnly: true,  // Prevents client-side JS access (XSS protection)
        secure: true // Only works on HTTPS
    }

     return res
     .status(200)
     .clearCookie("accessToken" , options)
     .clearCookie("refreshToken" , options)
     .json(
        new apiResponse(200, {}, "user logged out")
     )
})

const refreshAccessToken = asyncHandler ( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken //for mobile app 

    if(!incomingRefreshToken){
       throw new apiError(400, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
    
        const userExist = await user.findById(decodedToken?._id)
    
        if(!userExist){
           throw new apiError(400, "invalid user token")
        }
    
        if(incomingRefreshToken !== userExist.refreshToken){
           throw new apiError(400, "refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken , newRefreshToken} =  await generateRefreshTokenAndAccessToken(userExist._id)
    
        return res
        .status(200)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , newRefreshToken , options)
        .json(
            new apiResponse(
                200,
                {accessToken , refreshToken: newRefreshToken},
                "Access token refreshed"
                
            )
        )
    } catch (error) {
        throw new apiError(400, error?.message || "invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler ( async (req, res) => {
   const {oldPassword, newPassword} = req.body

   const UserExist = await user.findById(req.user?._id)
   
   const isPasswordCorrectOrNot = await UserExist.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrectOrNot){
    throw new apiError(400, "invalid old password")
   }

   UserExist.password = newPassword
   await UserExist.save({validateBeforeSave: false}) //baki ke validation run nahi krna chahta

   return res
   .status(200)
   .json(
    new apiResponse(
        200,
        {},
        "password change successfully"  
    )
   )
})

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(
        new apiResponse(
            200, {}, "current user fetched successfully"
        )
    )

})

const updateAccountDetails = asyncHandler( async (req, res) => {
    const {fullname , email} = req.body

    if(!fullname || !email){
        throw new apiError(200, "all fields are required") 
    }

    const UserExist = await user.findByIdAndUpdate(req.user?._id ,{
        $set: {
            fullname: fullname,
            email: email
        }
    },{new: true}).select("-password") //new isliye taki upd hone ke baad info return hoti he

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            {UserExist},
            "account details update successfully"
        )
    )

})

const updateUserAvatar = asyncHandler( async (req, res) => {
    const avatarImageLocalPath = req.file?.path

    if(!avatarImageLocalPath){
        throw new apiError(400 , "avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarImageLocalPath)

    if(!avatar.url){
        throw new apiError(400 , "error while (avatarImage) uploading to cloudinary")
    }

    const USER = await user.findByIdAndUpdate(req.user?._id , {
        $set: {
            avatar: avatar.url
        }
    }, {new: true}).select("-password")

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            USER,
            "avatar image updated successfully"
        )
    )

})

const updateUserCoverImage = asyncHandler( async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new apiError(400 , "avatar file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new apiError(400 , "error while (coverImage) uploading to cloudinary")
    }

    const USER = await user.findByIdAndUpdate(req.user?._id , {
        $set: {
            coverImage: coverImage.url
        }
    }, {new: true}).select("-password")

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            USER,
            "coverImage updated successfully"
        )
    )

})

const getUserChannelProfile = asyncHandler( async (req, res) => {
    const {username} = req.params

    if(!username?.trim()){
        throw new apiError(400, "username is missing")
    }

    const channel = await user.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscription",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                } 

            }
        },
        {
            $project: {
                fullname: 1,
                email: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
            }
        }
    ])

    console.log(channel);

    if(!channel.length){
        throw new apiError(400 , "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            channel[0],
            "user channel fetched successfully"
        )
    )
    
})

const getWatchHistory = asyncHandler( async (req, res) => {
   const USER = await user.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(req.user._id) 
            // We convert req.user._id to ObjectId because aggregation requires the _id
            // to be in ObjectId format for $match to work correctly.
        }
    },
    {
        $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "watchHistory",
            pipeline: [
               {
                    $lookup: {
                        from: "user",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline: [
                            {
                                $project: {
                                    fullname: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
               },
               {
                $addFields: {
                    owner: {
                        $first: "$owner"
                    }
                }
               }
            ]
        }
    },
   ])

   return res
   .status(200)
   .json(
    new apiResponse(
        200,
        USER[0], // you can write USER.[0].watchHistory as well 
        "watch history fetched successfully"
    )
   )
})

export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory}


import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"

const generateRefreshTokenAndAccessToken = async (userID) => {
    try {
        const USER = await user.findOne(userID)
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

   if(!username || !email){
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

    res
    .status(200)
    .cookie("accessToken : ", accessToken )
    .cookie("refreshToken : ", refreshToken )
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
    
})

export {registerUser , loginUser}

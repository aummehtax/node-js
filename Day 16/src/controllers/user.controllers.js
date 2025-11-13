
import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiResponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler( async (req , res) => {
   const {username, fullname, email, password} = req.body
   console.log("email : " , email);

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

export {registerUser}

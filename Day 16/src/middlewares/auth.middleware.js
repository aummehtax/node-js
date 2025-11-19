import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { user } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token){
            throw new apiError(400 , "Unauthorized request")
        }
    
        const decodeToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const userData  = await user.findById(decodeToken?._id).select("-password -refreshToken")
    
        if(!userData){
             throw new apiError(400 , "invalid access token")
        }
    
        req.user = userData
    
        next()
    } catch (error) {
        throw new apiError(400, error?.message || "invalid access token")
        
    }
})
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs" 

const uploadOnCloudinary = async (localFilePath) => {

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


    try {
        
        if(!localFilePath) return null

        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            
            resource_type: "auto"
        })
        console.log(`file is uploaded in cloudinary`, uploadResult.url);

        // Delete local file after successful upload
        if(uploadResult){
            fs.unlinkSync(localFilePath)
              return uploadResult
        }
        
            return null

        
        
    } catch (error) {
        console.error("Cloudinary upload error:", error);

        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath)        // Remove the locally saved temporary file if it exists
        }
        return null
    }
    
};

export {uploadOnCloudinary}
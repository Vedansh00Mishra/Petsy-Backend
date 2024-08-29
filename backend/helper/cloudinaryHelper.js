import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: 'ds3ltp1t1', 
    api_key: '157739186291887', 
    api_secret: '26A3K_v7aP43HAKkLTodttov7dk' // Click 'View Credentials' below to copy your API secret
});

const uploadImageOnCloudinary = async(filePath,folderName)=>{
    try {
        //uploading image from server
        const result = await cloudinary.uploader.upload(filePath,{
            folder: folderName
        })
        //delete image from server
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.log("failed to delete image from server", error)
        }

        return {
            secure_url: result.secure_url,
            public_id: result.public_id
        }
    } catch (error) {
        throw new Error(err);
    }
}

export {uploadImageOnCloudinary}
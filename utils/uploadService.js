const path = require('path')
const multer = require("multer");
const { error } = require('console');
const { resolveObjectURL } = require('buffer');
const cloudinary = require('cloudinary').v2

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true  // ensures https URLs

})


const upload = multer({ storage: multer.memoryStorage() })

const streamupload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: "profile_pics",
           
        },
            (error, result) => {
                if (error) reject(error); // Pass to global error handler
                else resolve(result)
                //  res.json({message:result.secure_url}) 
            })

        stream.end(buffer)

    })

}

const updatestreamUpload = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "profile_pics",
        public_id: publicId,   // Must match old image's public_id
        overwrite: true,
        invalidate: true,
        resource_type: "image", // Optional but good practice
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });
};




module.exports = { streamupload, upload }



const bcrypt = require('bcrypt')
const AuthUsers = require('../models/user.model')
const cloudinary = require('cloudinary').v2
const { streamupload } = require('../utils/uploadService')

exports.changepassword = async (req, res) => {

     const { newpassword } = req.body;
     const userprofile = await AuthUsers.findOne(req.user._id)
     const newhashedpassword = await bcrypt.hash(newpassword, 10)
     const compare = await bcrypt.compare(newpassword, userprofile.password)

     // console.log(compare)
     if (compare) {
          return false
     }

     else {
          await AuthUsers.findByIdAndUpdate(
               req.user._id,
               { password: newhashedpassword },
               { new: true }
          )

         
          return true
     }



}

exports.changeprofile = async (req, res) => {

     const userprofile = await AuthUsers.findOne(req.user._id)

     const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
               {
                    public_id: userprofile.photo_public_id,
                    overwrite: true,
                    invalidate: true,
                    resource_type: "image",
               },
               (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
               }
          );

          stream.end(req.file.buffer); // send the buffer to Cloudinary
     });


     console.log(result)
     if (result) {
          return true;
     }

     else {
          return false;
     }

}

exports.changename = async (req, res) => {
     const { username } = req.body;
     const userprofile = await AuthUsers.findOne(req.user._id)

     if (username === userprofile.username) {
          return false
     }
     userprofile.username = username;
     const result = await userprofile.save()
     if (result) {
          return true;
     }


}
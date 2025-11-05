const AuthUsers = require('../models/user.model')
const profileapi = require('../services/profileService')
const cloudinary = require('cloudinary').v2

const changename = async (req, res) => {
    const result = await profileapi.changename(req)
    if(result){
        res.status(201).json({
            status:true,
            message:"username has been changed"
        })
    }
    else{
        res.status(401).json({
            status:false,
            messaage:"username is same as before"
        })
    }
}

const changeprofile = async (req, res) => {

    const result = await profileapi.changeprofile(req)

    //   const avatarUrl = cloudinary.url(cloudresult.public_id, {
    //     width: 400,
    //     height: 400,
    //     crop: "fill",
    //     gravity: "face",
    //     radius: "max",
    //     quality: "auto",
    //     fetch_format: "auto"
    // });
    if(result){
       res.status(201).json({
        status:true,
        message:"Pic has been chaneged"
       })
    }

    else{

        res.status(401).json({
            staus:true,
            messaage:"Something went wrong"
        })
    }
    console.log(result)

}

const changepassword = async (req, res) => {

    const result = await profileapi.changepassword(req)
    if (result) {
        res.status(201).json({
            status: true,
            messaage: "password has been changed"
        })
    }
    else {
        res.status(401).json({
            status: false,
            messaage: "password is same as existed"
        })
    }

}

module.exports = { changename, changeprofile, changepassword }
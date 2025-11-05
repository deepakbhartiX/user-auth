const bcrypt = require('bcrypt')
const AuthUsers = require('../models/user.model')
const cloudinary = require('cloudinary').v2
const createTokenAndCookie = require('../jwt/user.auth.token');
const AppError = require('../utils/AppError');
const { streamupload } = require('../utils/uploadService')

//sign logic

exports.sign = async (req) => {


    const { username, email, password } = req.body;



    // if (Object.values(otpStore)[0] !== "VERIFIED") {

    //     throw new AppError("Mobile Number Not Verified Please Verify OTP First", 403)

    // }


    const user = await AuthUsers.findOne({ email })

    if (user) {

        throw new AppError("Email alraedy exist", 400)

    }


    const hashedpassword = await bcrypt.hash(password, 10)


    let cloudresult = await streamupload(req.file.buffer)
    // console.log(cloudresult)


    //sotred pubic_id of pic use to genrerate custom size avatar pic 

    const avatarUrl = cloudinary.url(cloudresult.public_id, {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        radius: "max",
        quality: "auto",
        fetch_format: "auto"
    });

    // console.log(avatarUrl);
    // console.log(cloudresult)

    const newUser = await new AuthUsers({
        username,
        email,
        // mobile: Object.keys(otpStore)[0],
        password: hashedpassword,
        photo_public_id: cloudresult.public_id,

    })



    newUser.save();

    otpStore = {} // clear after signup



    if (newUser) {
        const token = createTokenAndCookie(newUser._id)

        return { newUser, token, avatarUrl }

    }


}


//login logic


exports.login = async (req, res) => {


    const { email, password } = req.body;

    const valibate = await AuthUsers.findOne({ email })


    if (!valibate) {
        throw new AppError("user not found", 404)
        // return res.status(404).json({ Error: 'user not found' })
    }

    const compare = await bcrypt.compare(password, valibate.password)

    if (!compare) {
        throw new AppError("password wrong", 404)
        // return res.status(404).json({ Error: "password wrong" })
    }

    //sotred pubic_id of pic use to genrerate custom size avatar pic 

    const avatarUrl = await cloudinary.url(valibate.photo_public_id, {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        radius: "max",
        quality: "auto",
        fetch_format: "auto"
    });

    // console.log(avatarUrl)
    const token = createTokenAndCookie(valibate._id)


    return { valibate, token, avatarUrl }



}


exports.logout = async () => {

    return clearCookie('jwt');



}
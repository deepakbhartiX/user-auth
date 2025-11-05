const AuthUsers = require('../models/user.model')
const AppError = require('../utils/AppError');

//importing sms logic
const sms = require('../services/otpService')
//importing signup and login logic
const auth = require('../services/authService')


//sms logic

const sendOtp = async (req, res) => {

    const sendOtp = await sms.sendOtp(req)

    if (sendOtp === true) {
        res.json({ status: false, message: "Mobile Number already exist" })
    }

    else {
        console.log(`Mock OTP for ${sendOtp.mobile} : ${sendOtp.otp}`); // replace with SMS API later

        res.json({ message: "OTP sent (mock)" });
    }
}

const verifyOTP = async (req, res) => {

    const verify = await sms.verifyOtp(req)
    // console.log(verify)
    if (verify) {
        return res.json({
            success: true, message: "OTP verified",

        });
    }
    else{
        return res.status(401).json({
            success:false,message:"Invalid OTP"
        })
    }
}


//user auth logic
const sign = async (req, res) => {


    const sign = await auth.sign(req)


    return res.status(201).cookie('jwt', sign.token, {
        httpOnly: true, //xss attacks
        secure: true,
        sameSite: "strict", //csrf attack
    }).json(
        {
            message: 'User Registered sucessfully', user: {
                _id: sign.newUser._id,
                name: sign.newUser.name,
                email: sign.newUser.email,
                mobile: sign.newUser.mobile,
            }
            ,
            picURL: sign.avatarUrl,
        }
    )


}

const login = async (req, res) => {

    const login = await auth.login(req)
    // console.log(login.avatarUrl)
    return res.status(201).cookie('jwt', login.token, {
        httpOnly: true, //xss attacks
        secure: true,
        sameSite: "strict", //csrf attack
    }).json({
        message: 'User login', user: {
            _id: login.valibate._id,
            name: login.valibate.name,
            email: login.valibate.email,

        },

        picURL: login.avatarUrl


    })

}


//logout controller logic

const logout = async (req, res) => {

    const logout = await auth.logout()


    return res.status(200).logout.json({ message: "user logged out sucessfully" })



    // res.clearCookie('jwt');
    // return res.status(200).json({ message: "user logged out sucessfully" })


}



module.exports = { sign, login, logout, sendOtp, verifyOTP }









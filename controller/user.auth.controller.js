const bcrypt = require('bcrypt')

const AuthUsers = require('../models/user.model')
const { rateLimit } = require('express-rate-limit');

const createTokenAndCookie = require('../jwt/user.auth.token');
const AppError = require('../utils/AppError');
const { response } = require('express');


let otpStore = {};  //store otp for temp



// Mobile validation (10 digits, starts 6-9 for India)

function isValidMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
}



// Generate random 4-digit OTP
function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000);
}



//  Send OTP
const sendOtp = async (req, res) => {


    const { mobile } = req.body;


    if (!mobile || !isValidMobile(mobile)) {
        throw new AppError("Invalid mobile Number", 400)
    }


    const otp = generateOtp();
    otpStore[mobile] = otp;



    //deleting 1st element in otpStore Object to get remains latest element which used for fetch from db

    if (Object.keys(otpStore).length > 1) {
        delete otpStore[Object.keys(otpStore)[0]]
        // console.log(Object.keys(otpStore))
    }



    const Otpexist = await AuthUsers.findOne({ mobile: Object.keys(otpStore) })


    //storing db fethch data for express limiter skip request
    existedNumbr = Boolean(Otpexist)

    

    if (Otpexist) {
        res.json({ status: false, message: "Mobile Number already exist" })
    }

    else {
        console.log(`Mock OTP for ${mobile}: ${otp}`); // replace with SMS API later

        res.json({ message: "OTP sent (mock)" });

    }




};



//for skipping request for exist phone number

let existedNumbr

// OTP rate limiter for 5 sec 
const limiter = rateLimit({
    windowMs: 30 * 1000,
    limit: 1,
    skip:(request,response)=>{
        return existedNumbr
    } ,
    handler: (req, res) => {
        throw new AppError("Wait for few second for OTP", 429)
    },
 
    // message:"To Many API request", 
})

  


//  Verify OTP
const verifyOtp = (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
        throw new AppError("Invalid Mobile Number", 400)

    }


 


    if (otpStore[mobile] == otp) {
        otpStore[mobile] = "VERIFIED"; // mark as verified
        otpStore = ""
        return res.json({
            success: true, message: "OTP verified",
            mobile: Object.keys(otpStore)
        });

    }



    else {

        throw new AppError("Invalid OTP", 400)

    }
};


// Signup (only if OTP verified)


const sign = async (req, res) => {


    const { name, email, password } = req.body;



    if (Object.values(otpStore)[0] !== "VERIFIED") {

        throw new AppError("Mobile Number Not Verified Please Verify OTP First", 403)

    }


    const user = await AuthUsers.findOne({ email })

    if (user) {

        throw new AppError("Email alraedy exist", 400)

    }


    const hashedpassword = await bcrypt.hash(password, 10)


    const newUser = await new AuthUsers({
        name,
        email,
        mobile: Object.keys(otpStore)[0],
        password: hashedpassword,
        profileImage: req.file.buffer,       // save binary data
        profileImageType: req.file.mimetype, // save type (jpg/png)


    })



    newUser.save();

    otpStore = {} // clear after signup



    if (newUser) {
        createTokenAndCookie(newUser._id, res)
        return res.status(201).json({
            message: 'User Registered sucessfully', user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                profile: newUser.profileImageType,

            }
        })
    }


}


//login controller logic


const login = async (req, res) => {


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


    createTokenAndCookie(valibate._id, res)

    return res.status(201).json({
        message: 'User login', user: {
            _id: valibate._id,
            name: valibate.name,
            email: valibate.email,
        }
    })


}


//logout controller logic

const logout = async (req, res) => {

    res.clearCookie('jwt');
    return res.status(200).json({ message: "user logged out sucessfully" })

}



module.exports = { sign, login, logout, sendOtp, verifyOtp, limiter }








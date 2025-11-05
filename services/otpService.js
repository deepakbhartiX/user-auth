const AppError = require('../utils/AppError');
const conditionalLimiter = require('../utils/ratelimiter')
let otpStore = {};  //store otp for temp
const AuthUsers = require('../models/user.model')


// Mobile validation (10 digits, starts 6-9 for India)


function isValidMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
}



// Generate random 4-digit OTP
function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000);
}



//  Send OTP
exports.sendOtp = async (req, res) => {


    const { mobile } = req.body;


    if (!mobile || !isValidMobile(mobile)) {
        throw new AppError("Invalid mobile Number", 400)
    }


    const otp = generateOtp();
    otpStore[mobile] = otp;



    //deleting 1st element in otpStore Object to get remains latest element which used for fetch from db

    if (Object.keys(otpStore).length > 1) {
        delete otpStore[Object.keys(otpStore)[0]]

    }



    const Otpexist = await AuthUsers.findOne({ mobile: Object.keys(otpStore) })


    if (Otpexist) {
        return true
    }

    else {
        return { mobile, otp }
    }



};



//  Verify OTP
exports.verifyOtp = (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
        throw new AppError("Invalid Mobile Number", 400)

    }


    if (otpStore[mobile] == otp) {
        otpStore[mobile] = "VERIFIED"; // mark as verified
        otpStore = ""

        return true

    }



    else {

        return false

    }
};


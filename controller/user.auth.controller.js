const bcrypt = require('bcrypt')

const AuthUsers = require('../models/user.model')


const createTokenAndCookie = require('../jwt/user.auth.token');
const AppError = require('../utils/AppError');


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
const sendOtp = (req, res) => {
    const { mobile } = req.body;
    if (!mobile || !isValidMobile(mobile)) {
        return res.status(400).json({ error: "Invalid mobile number" });
    }

    const otp = generateOtp();
    otpStore[mobile] = otp;

    console.log(`Mock OTP for ${mobile}: ${otp}`); // replace with SMS API later

    res.json({ message: "OTP sent (mock)" });
};


//  Verify OTP
const verifyOtp = (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
        return res.status(400).json({ error: "Invalid mobile number" });
    }

    if (otpStore[mobile] && otpStore[mobile] == otp) {
        otpStore[mobile] = "VERIFIED"; // mark as verified
        return res.json({ success: true, message: "OTP verified" });
    } else {
        return res.status(400).json({ success: false, error: "Invalid OTP" });
    }
};


// Signup (only if OTP verified)


const sign = async (req, res) => {


    try {

        const { name, email, password } = req.body;

        // console.log(Object.values(otpStore)[0])

        // if (Object.values(otpStore)[0] !== "VERIFIED") {
        //     return res
        //         .status(403)
        //         .json({ error: "Mobile number not verified. Please verify OTP first." });
        // }


        const user = await AuthUsers.findOne({ email })

        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
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


    } catch (error) {
        console.log("this is Sign error : ", error)
        return res.status(500).json({ message: "Server Error" })
    }
}


//login controller logic


const login = async (req, res) => {
 

        const { email, password } = req.body;

        const valibate = await AuthUsers.findOne({ email,password })


        if (!valibate) {
            throw new AppError("user not found",404)
            // return res.status(404).json({ Error: 'user not found' })
        }

        const compare = await bcrypt.compare(password, valibate.password)

        if (!compare) {
            throw new AppError("password wrong",404)
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


        // console.log("this is login error : ", error)
        // return res.status(500).json({ message: "Server Error" })
       
    
}


//logout controller logic

const logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.status(200).json({ message: "user logged out sucessfully" })

    } catch (error) {
        console.log("this is logout error : ", error)
        return res.status(500).json({ message: "Server Error" })
    }
}





module.exports = { sign, login, logout, sendOtp, verifyOtp }














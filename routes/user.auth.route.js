const express = require('express');
const { sign, login, logout ,sendOtp,verifyOTP} = require('../controller/user.auth.controller')
const { secureRoute } = require('../middleware/secure.route')
const { getallUsers } = require('../controller/user.data.controller')

const multer = require("multer");
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const { upload } = require('../utils/uploadService')

const apiLimit = require('../utils/ratelimiter')

const userauth = require('../services/authService')

//injecting route

const route = express.Router();


//all routes for backend


//otp verification routes
route.post('/api/send-otp', apiLimit.limiter, asyncHandler(sendOtp))

route.post('/api/verify-otp', asyncHandler(verifyOTP))


//user auth routes

route.post('/api/sign', upload.single("profileImage"), asyncHandler(sign));

route.post('/api/login', asyncHandler(login))

route.post('/api/logout', asyncHandler(logout))

//user profile update routes

// route.post('/api/uplaodImage', upload.single("profileImage"), asyncHandler(uplaodImage))

//user feature routes

route.get('/api/getallUser', asyncHandler(secureRoute), asyncHandler(getallUsers))


module.exports = { route }
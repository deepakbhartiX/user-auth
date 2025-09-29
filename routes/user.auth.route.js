const express = require('express');
const { sign, login, logout, verifyOtp, sendOtp } = require('../controller/user.auth.controller')
const { secureRoute } = require('../middleware/secure.route')
const { getallUsers } = require('../controller/user.data.controller')
const {limiter} = require('../controller/user.auth.controller')
const multer = require("multer");
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { uplaodImage} = require('../controller/user.pic.controller');
const {upload} = require('../controller/user.pic.controller')

//injecting route

const route = express.Router();


//all routes for backend

route.post('/api/send-otp', limiter, asyncHandler(sendOtp))

route.post('/api/verify-otp', asyncHandler(verifyOtp))


route.post('/api/sign', upload.single("profileImage"), asyncHandler(sign));


route.post('/api/login', asyncHandler(login))

route.post('/api/logout', asyncHandler(logout))

route.get('/api/getallUser', asyncHandler(secureRoute), asyncHandler(getallUsers))


route.post('/api/uplaodImage',upload.single("profileImage"),asyncHandler(uplaodImage))

module.exports = { route }
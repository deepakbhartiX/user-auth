const express = require('express');
const { sign, login, logout, verifyOtp, sendOtp } = require('../controller/user.auth.controller')
const { secureRoute } = require('../middleware/secure.route')
const { getallUsers } = require('../controller/user.getalluser')
const {limiter} = require('../controller/user.auth.controller')
const multer = require("multer");
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// store file in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const route = express.Router();




//all routes for backend

route.post('/api/send-otp', limiter, asyncHandler(sendOtp))

route.post('/api/verify-otp', asyncHandler(verifyOtp))

route.post('/api/sign', upload.single("profileImage"), asyncHandler(sign));


route.post('/api/login', asyncHandler(login))

route.post('/api/logout', asyncHandler(logout))

route.get('/api/getallUser', asyncHandler(secureRoute), asyncHandler(getallUsers))

module.exports = { route }
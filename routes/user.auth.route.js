const express = require('express');
const {sign,login, logout, verifyOtp, sendOtp} = require('../controller/user.auth.controller')
const {secureRoute} = require('../middleware/secure.route')
const {getallUsers} = require('../controller/user.getalluser')

const multer = require("multer");
const asyncHandler = require('../utils/asyncHandler');

// store file in memory instead of disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const route = express.Router();

route.post('/api/send-otp',sendOtp)

route.post('/api/verify-otp',verifyOtp)

route.post('/api/sign',upload.single("profileImage") ,sign);


route.post('/api/login', asyncHandler(login))

route.post('/api/logout', logout)

route.get('/api/getallUser', secureRoute, getallUsers)

module.exports = { route }
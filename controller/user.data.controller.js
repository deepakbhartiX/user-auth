
const AuthUsers = require('../models/user.model')
const users  = require('../services/userService')



//api route to get all user from db 


const getallUsers = async (req, res) => {

    const result = await users.getall(req)
    return res.status(201).json(result)
   
}




module.exports = { getallUsers }
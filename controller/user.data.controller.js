
const AuthUsers = require('../models/user.model')

const path = require('path')


//api route to get all user from db 


const getallUsers = async (req, res) => {


    const loggedInUser = req.user._id;
    const filterUsers = await AuthUsers.find({
        _id: { $ne: loggedInUser },
    }).select("-password").select("-profileImage")

    return res.status(201).json({ filterUsers })

}



// console.log("helo")



// const lol = 'C:\Users\Deepak Bharti\Desktop\user auth\controller/VSBQmL5wk.webp'



module.exports = { getallUsers }
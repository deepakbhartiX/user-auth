
const AuthUsers = require('../models/user.model')

const getallUsers = async (req, res) => {


        const loggedInUser = req.user._id;
        const filterUsers = await AuthUsers.find({
            _id: { $ne: loggedInUser },
        }).select("-password").select("-profileImage")

        return res.status(201).json({ filterUsers })

    }

module.exports = {getallUsers}
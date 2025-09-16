
const AuthUsers = require('../models/user.model')

const getallUsers = async (req, res) => {

    try {

        const loggedInUser = req.user._id;
        const filterUsers = await AuthUsers.find({
            _id: { $ne: loggedInUser },
        }).select("-password").select("-profileImage")

        return res.status(201).json({ filterUsers })

    } catch (error) {

        return res.status(500).json({ message: "Server error from getallUsers contorller" })
    }
}

module.exports = {getallUsers}
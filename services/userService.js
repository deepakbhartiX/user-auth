
const AuthUsers = require('../models/user.model')



exports.getall = async(req,res) => {


    const loggedInUser = req.user._id;
    const filterUsers = await AuthUsers.find({
        _id: { $ne: loggedInUser },
    }).select("-password").select("-profileImage")

    return filterUsers

}
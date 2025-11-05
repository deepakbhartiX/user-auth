const jwt = require('jsonwebtoken')
const AuthUsers = require('../models/user.model')


const secureRoute = async (req, res, next) => {
   
        const token = req.cookies.jwt

        
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const verified = jwt.verify(token, process.env.JWT_TOKEN,)

        // console.log(verified)

        if (!verified) {
            return res.status(403).json({ message: "Invalid token" })
        }

        const user = await AuthUsers.findById(verified.username).select("-password");


        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();


}


module.exports = { secureRoute };



const mongodb = require('mongoose')

//mongodb database schema for authenticate user's login and signup

const userScheme = mongodb.Schema({

    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,

    },
    mobile: {
        type: String,
        unique: true
    },

    password: {
        type: String,
        requrie: true,

    },

    profileImage: { type: Buffer },
    profileImageType: { type: String },

   


}, { timestamp: true })


userScheme.virtual("profileImagePath").get(function () {
    if (this.profileImage != null && this.profileImageType != null) {
        return `data:${this.profileImageType};base64,${this.profileImage.toString("base64")}`;
    }
});


module.exports = mongodb.model('AuthUsers', userScheme)


const mongodb = require('mongoose')

//mongodb database schema for authenticate user's login and signup

const userScheme = mongodb.Schema({

    username: {
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

    photo_public_id: { type: String },
   


}, { timestamp: true })




module.exports = mongodb.model('AuthUsers', userScheme)


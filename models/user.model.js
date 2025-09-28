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

    picurl: { type: String },
   


}, { timestamp: true })




module.exports = mongodb.model('AuthUsers', userScheme)


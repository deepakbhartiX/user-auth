const AppError = require('../utils/AppError')
const rateLimit = require('express-rate-limit')
exports.limiter = rateLimit({
    windowMs: 30 * 1000,
    limit: 3,
   
    handler: (req, res) => {
        throw new AppError("Wait for few second ", 429)
    },

    // message:"To Many API request", 
})


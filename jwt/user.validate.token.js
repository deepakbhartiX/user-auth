const jwt = require('jsonwebtoken')


const validatetoken = ((req, res, next) => {

    // const {token}

    if (!req.cookies.jwt) {
        return res.redirect('/login')
    }

   

    const userinfo = jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN,)

    if (!userinfo) {
        return res.redirect('/login'
        )

    }

    req.user = userinfo

    console.log(req.user.username)

    next()
})


module.exports = validatetoken





 
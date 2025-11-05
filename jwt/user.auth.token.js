
const jwt = require('jsonwebtoken');

//jwt token creation and response token as cookie

const createTokenAndCookie = (username) => {
   
        const token = jwt.sign({ username }, process.env.JWT_TOKEN, {
            // expiresIn: "10s"
        })

       
        // return res.cookie('jwt', token, {
        //     httpOnly: true, //xss attacks
        //     secure: true,
        //     sameSite: "strict", //csrf attack
        // })

        return token;
    
}
module.exports = createTokenAndCookie
const sendToken = function(user, statusCode, res, message) {
    
    const token = user.getJWTtoken();

    //options for cookie
    const options = {
        httponly: true,
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24  * 60 * 60 * 60 * 1000
        )
    }

    return res.status(statusCode).cookie('token', token, options).json({
        success:message, 
        user,
        token
    })
}

module.exports = sendToken;
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

module.exports.isAuthenticated = async function(req, res, next) {
    try {
        const { token } = req.cookies;

        console.log('request.cookies', req.cookies);

        
        
        if(!token) {
            return res.status(400).json({
                success: false,
                message: 'login first'
            })
        }
    
        const decodedData = await jwt.verify(token, process.env.JWT_SECRET);
        console.log('decodeddata',decodedData);

        req.user = await User.findById(decodedData._id);
        // req.user = await User.findById(mongoose.Types.ObjectId(decodedData._id));

        console.log('req.user', req.user);
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
        
    }

}

// module.exports.authorisedRoles = async function(...roles) {
//     return (req, res, next) => {
//         if(req.user.role !== 'admin') {
//             return res.status(500).json({
//                 success:true,
//                 message: `${req.user.role} is not authorised to access the following data`
//             })

//         }
//         next();
//     }
// }

module.exports.authorisedRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return new Error('nope, only admins can access this data');
        }
        next();
    }
}
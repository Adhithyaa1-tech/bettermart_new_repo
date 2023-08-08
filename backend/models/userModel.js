const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please enter Your Name"],
        maxLength: [20, "Cannot exceed 20 characters"],
        minLength: [4, "Length should be greater than 3"]
    },

    email: {
        type:String,
        required: [true, "Please enter ur email"],
        unique: true,
        validate: [validator.isEmail, "pls enter valid email"]
    },

    password: {
        type:String,
        required: [true, "enter ur password"],
        minLength: [8, "password should be greater than 8 characters"],
        select:false
    },

    avatar: {
        public_id: {
            type:String,
            required: true
        },

        url: {
            type:String,
            required: true
        },
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {
    timeStamps:true
});

// userSchema.pre("save", async function(next) {
//     this.password = await bcrypt.hash(this.password, 10);
// })


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})


// //jwt web token
// userSchema.methods.getJWTtoken = function() {
//     //'this' is referring to the userSchema object

//     return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE
//     });
// }

userSchema.methods.generateToken =  function() {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
        expiresIn: '5d',
    });
}


userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}




module.exports = mongoose.model("User", userSchema);
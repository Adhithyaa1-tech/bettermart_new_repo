const { response } = require("express");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHander = require("../utils/errorHandler");

module.exports.register = async function (req, res) {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatars",
      width: 150,
      crop: "scale",
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,

      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    console.log( 'Newuser', user   );

    // const token = user.getJWTtoken();

    // return res.status(200).json({
    //     success: true,
    //     token,
    // })
    // sendToken(user, 200, res, "successfully registered");

    const token = await user.generateToken();

    console.log('TOKEN GENERATED', token);

    return res.status(200).cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true
    }).json({
        success: true,
        message: 'user created',
        user,
        token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//login

module.exports.login = async function (req, res, next) {
  try {

    const { email, password } = req.body;



    // if (!email || !password) {
    //   console.log("enter all the fields");
    //   return res.status(400).json({
    //     message:"enter correct email/password",
    //   })
    // }

    if (!email || !password) {
      return next(new ErrorHander("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email: email }).select("+password");
  
    // if (!user) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "Invalid email or password",
    //   });
    // }

    if (!user) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
  
    console.log("user", user);
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Invalid email or password", 401));
    }
    // const token = User.getJWTtoken();
    // return res.status(200).json({
    //     success: true,
    //     token
    // })
  
    // sendToken(user, 200, res, "successfully logged in");
    const token = await user.generateToken();
  
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "user found",
        user,
        token,
      });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    })
    
  }

};

module.exports.logout = async function (req, res) {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httponly: true,
  });

  return res.status(200).json({
    success: true,
    message: "successfully logged out!",
  });
};

// module.exports.forgotPassword = async function (req, res) {

//   try {

    
//   const user = await User.findOne({ email: req.body.email });

//   if (!user) {
//     return res.status(500).json({
//       message: "User not found",
//     });
//   }

//   const resetToken = user.getResetPasswordToken();
//   console.log('resettok', resetToken)

//   await user.save({ validateBeforeSave: false });

//   const resetPasswordUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/password/reset/${resetToken}`;

//   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If u have not requested this email, pls ignore it.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Ecommmerce`,
//       message,
//     });

//     return res.status(200).json({
//       success: true,
//       message: `email sent successfully to ${user.email}`,
//     });
//   } catch (err) {
//     console.log(err);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return res.status(500).json({
//       message: `error: ${err}`,
//     });
//   }
    
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error,
//     })
    
//   }




// };





// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body.email);
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(500).json({
            message: "User not found",
          });
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

  const message = `Your password reset token is ttemp:- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
            message: `error: ${error}`,
          });
  }
});



module.exports.resetPassword = async function (req, res) {
  try {
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "couldnt find user",
    });
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Invalid",
    });
  }

  user.password = req.body.password;
  await user.save();

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    })
    
  }
  
};

module.exports.getUserDetails = async function (req, res) {
  try {
    console.log("getuserdetails", req.user);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    // console.log('user hrer hrer', user);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("error in getDetails controller", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  // console.log('req.user.id', req.user._id)
};

module.exports.updatePassword = async function (req, res) {
  try {
    // console.log('req.user', req.user);

    console.log('req.body', req.body);
    const user = await User.findById(req.user._id).select("+password");
    
    

    if(!user ) {
        return res.status(401).json({
            success: false,
            message: 'user not found'
        })
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        console.log('incorrect passwords')
      return res.status(400).json({
        message: "incorrect password",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        console.log(req.body.newPassword);
        console.log(req.body.confirmPassword);
        console.log('passwords not matched')
      return res.status(400).json({
        message: "passwords not matched",
      });
    }
    user.password = req.body.newPassword;
    await user.save();

    // sendToken(user, 200, res, "Password successfully updated");
    const token = await user.generateToken();

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "user found",
        user,
        token,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: error.message
    })
  }
};

module.exports.updateUserProfile = async function (req, res) {
  try {
    const newUserdata = {
      name: req.body.name,
      email: req.body.email,
      
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserdata.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllusers = async function (req, res) {
  const users = await User.find();

  return res.status(200).json({
    success: true,
    users,
  });
};

module.exports.deleteUser = async function (req, res) {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(500).json({
      success: false,
    });
  }
  await user.remove();

  return res.status(200).json({
    success: true,
  });
};

/*{
    "name" : "adhithyaacchenji",
    "email" : "adhithyaac.ec20@rvce.edu.in",
    "password": "cchenji1234"
}*/

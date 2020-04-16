// const { promisify } = require("util");
// const jwt = require("jsonwebtoken");
// const User = require("./../models/userModels");
// const catchAsync = require("./../utils/catchAsync");
// const sendEmail = require("./../utils/email");
// const crypto = require("crypto");

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE_IN,
//   });
// };

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);

//   return res.status(statusCode).json({
//     status: "success",
//     token,
//     data: {
//       user,
//     },
//   });
// };

// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: {
//       user: newUser,
//     },
//   });
// });

// // exports.signup = (req, res, next) => {
// //     const newUser = User.create(req.body);
// //     const token = signToken(newUser._id);
// //     newUser.then(data => {
// //         return res.status(201).json({
// //             status: 'success',
// //             token,
// //             data: data
// //         });
// //     }).catch(err => {
// //         return res.status(400).json({
// //             status: 'fail',
// //             meassage: err
// //         })
// //     });
// // }

// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   // 1) check if email and password are exit
//   if (!email || !password) {
//     return res.status(400).json({
//       status: "fail",
//       message: "please provide email",
//     });
//   }

//   // 2) check if user is exist && password is correct
//   const user = await User.findOne({ email }).select("+password");

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return res.status(401).json({
//       status: "fail",
//       message: "user email and passsword not match",
//     });
//   }

//   // 3) if everything ok, send token to client
//   const token = signToken(user._id);
//   return res.status(200).json({
//     status: "success",
//     token,
//   });
// };

// // create middleware function to protect routes

// exports.protect = async (req, res, next) => {
//   // 1) Getting Token and check if it's there or not
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }
//   console.log(token);

//   if (!token) {
//     return res.status(401).json({
//       status: "fail",
//       message: "You are not loggged In",
//     });
//   }
//   // 2) Verificaion of Token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   console.log(decoded);

//   // 3) Check if user still exist

//   // 4) Check if user changed the Password after Token was issued

//   next();
// };

// // Forgot Password and reset Password

// exports.forgotPassword = async (req, res, next) => {
//   // 1) get the user based on posted Email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return res.status(404).json({
//       status: "fail",
//       message: "there is no user with this email address",
//     });
//   }
//   // 2) generate the random Reset Token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   //3) sent it to user's Email
//   // const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
//   // const message = 'Forgot your passworrd? submit a Patch request with your new Password and passwordConfirm to: ${resetURL}.\n if you do not forgot your password please Ignore this mail.'

//   // try {
//   //     await sendEmail({
//   //         email: user.email,
//   //         subject: "Your Password Reset Token (valid for 10 minutes)",
//   //         message
//   //     });

//   //     res.status(200).json({
//   //         status: 'success',
//   //         message: 'Token sent to Email Successfully'
//   //     });

//   // } catch (err) {
//   // user.passwordResetToken = undefined;
//   // user.passwordResetExpires = undefined;
//   // await user.save({ validateBeforeSave: false });

//   //     res.status(500).json({
//   //         meassage: 'there was an error to sending the mail, please try later.',
//   //         status: err
//   //     });
//   // }
// };

// exports.resetPassword = async (req, res, next) => {
//   // 1) Get User based on Token
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await User.findOne({
//     passwordRestToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If Token has not Expired, and ther is User, then allow to set new Password
//   if (!user) {
//     return res.status(401).json({
//       status: "fail",
//       meassage: "Token is Invalid or has expired",
//     });
//   }
//   user.password = req.body.password;
//   user.confirmPassword = req.body.confirmPassword;
//   user.passwordRestToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changePasswordAt property for user
//   // 4) Log the User In , and send The Jwt Token
//   res.status(200).json({
//     status: "success",
//     token,
//   });
// };

// exports.updatePassword = async (req, res, next) => {
//   // 1) Get User from Collection
//   const user = await User.findById(req.user.id).select("+password");

//   // 2) Check if posted current password is Correct
//   if (!(await user.correctPassword(req.body.confirmPassword, user.password))) {
//     res.status(401).json({
//       status: "fail",
//       message: "your current password is wrong",
//     });
//   }

//   // 3) If so, update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();

//   // 4) Log User in, send JWT
//   createSendToken(user, 200, res);
// };
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
  // const token = signToken(user._id);
  // res.status(statusCode).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user
  //   },
  // });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password are exit
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) check if user is exist && password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 3) if everything ok, send token to client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // return res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting Token and check if it's there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in! please logged in to get access.",
        401
      )
    );
  }
  // 2) Verificaion of Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The User belonging to this token does no longer exist.",
        401
      )
    );
  }
  // 4) Check if user changed the Password after Token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password !please log in again")
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

// authorization

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles['admin', 'lead-guide']. role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// forgotPassword
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get the user based on posted Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with this email address", 404));
  }
  // 2) generate the random Reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3) sent it to user's Email
  // const resetURL = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/resetPassword/${resetToken}`;

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  // try {
  //   await sendEmail({
  //     email: user.email,
  //     subject: "Your password reset token (valid for 10 min)",
  //     message,
  //   });

  //   res.status(200).json({
  //     status: "success",
  //     message: "Token sent to email!",
  //   });
  // } catch (err) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });

  //   return next(
  //     new AppError("There was an error sending the email. Try again later!"),
  //     500
  //   );
  // }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is Invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user

  // 4) send token
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   starts: "success",
  //   token,
  // });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get User from Collection
  console.log(req.user);
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if posted current password is Correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("your current password is wrong", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // User.findByIdAndUpdate will not work as intended

  // 4) Log User In, send JWT
  createSendToken(user, 200, res);
});

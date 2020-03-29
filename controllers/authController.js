const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModels');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_IN });
}

// exports.signup =async (req, res, next) => {
//     try {
//         const newUser =await User.create(req.body);
//         const token =  signToken(newUser._id);

//         return res.status(201).json({
//             status: 'success',
//             token,
//             //data: newUser
//         });

//     }
//     catch (err) {
//         return res.status(400).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }


exports.signup = (req, res, next) => {
    const newUser = User.create(req.body);
    const token = signToken(newUser._id);
    newUser.then(data => {
        return res.status(201).json({
            status: 'success',
            token,
            data: data
        });
    }).catch(err => {
        return res.status(400).json({
            status: 'fail',
            meassage: err
        })
    });
}

exports.login = async (req, res, next) => {

    const { email, password } = req.body;

    // 1) check if email and password are exit
    if (!email || !password) {
        return res.status(400).json({
            status: "fail",
            message: "please provide email"
        })
    }



    // 2) check if user is exist && password is correct
    const user = await User.findOne({ email }).select('+password');


    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            status: "fail",
            message: "user email and passsword not match"
        });
    }

    // 3) if everything ok, send token to client
    const token = signToken(user._id)
    return res.status(200).json({
        status: "success",
        token
    })

}

// create middleware function to protect routes

exports.protect = async (req, res, next) => {
    // 1) Getting Token and check if it's there or not
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not loggged In'
        })
    }
    // 2) Verificaion of Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);

    // 3) Check if user still exist

    // 4) Check if user changed the Password after Token was issued

    next();
}


// Forgot Password and reset Password

exports.forgotPassword = async (req, res, next) => {
    // 1) get the user based on posted Email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({
            status: 'fail',
            message: 'there is no user with this email address'
        })
    }
    // 2) generate the random Reset Token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //3) sent it to user's Email
    // const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    // const message = 'Forgot your passworrd? submit a Patch request with your new Password and passwordConfirm to: ${resetURL}.\n if you do not forgot your password please Ignore this mail.'


    // try {
    //     await sendEmail({
    //         email: user.email,
    //         subject: "Your Password Reset Token (valid for 10 minutes)",
    //         message
    //     });
    

    //     res.status(200).json({
    //         status: 'success',
    //         message: 'Token sent to Email Successfully'
    //     });

    // } catch (err) {
        // user.passwordResetToken = undefined;
        // user.passwordResetExpires = undefined;
        // await user.save({ validateBeforeSave: false });

    //     res.status(500).json({
    //         meassage: 'there was an error to sending the mail, please try later.',
    //         status: err
    //     });
    // }
};



exports.resetPassword = async (req, res, next) => {
    // 1) Get User based on Token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordRestToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If Token has not Expired, and ther is User, then allow to set new Password
    if (!user) {
        return res.status(401).json({
            status: 'fail',
            meassage: 'Token is Invalid or has expired'
        })
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordRestToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changePasswordAt property for user
    // 4) Log the User In , and send The Jwt Token
    res.status(200).json({
        status: 'success',
        token
    })
}





exports.hallo = async (req, res, next) =>{
    console.log("hvhvhvyv")

}
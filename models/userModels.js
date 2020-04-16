// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");
// const crypto = require("crypto");
// // name, email, photo, password, confirmpassword

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "please tell us your name!"],
//   },
//   email: {
//     type: String,
//     required: [true, "please provide your email address"],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, "please provide a valid email"],
//   },
//   photo: String,
//   password: {
//     type: String,
//     required: [true, "please provide a passord!"],
//     minlength: 8,
//   },
//   confirmPassword: {
//     type: String,
//     required: [true, "please confirm your password"],
//     validate: {
//       // this work only for save or create
//       validator: function(el) {
//         return el === this.password;
//       },
//       message: "Password are not the same!",
//     },
//   },
//   // passwordResetToken: String,
//   // passwordResetExpires: Date
// });

// // userSchema.pre('save', async function(next){

// //     // Only run this function if password was actually modified
// //    if(!this.isModified('password')) return next();

// //    // Hash the password with the cost of 12
// //    this.password = await bcrypt.hash(this.password, 20);

// //    // Delete the confirmPassword field;
// //    this.confirmPassword = undefined;
// //    next();
// // });

// // userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
// //     return await bcrypt.compare(candidatePassword, userPassword);
// // };

// // userSchema.methods.createPasswordResetToken = function(){
// //     const resetToken = crypto.randomBytes(32).toString('hex');

// //     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

// //     console.log({resetToken}, this.passwordResetToken)
// //     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
// //     return resetToken;
// // }

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// // name, email, photo, password, confirmpassword

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "please provide a passord!"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      // this work only for save or create
      validator: function(el) {
        return el === this.password;
      },
      message: "Password are not the same!",
    },
  },
  passworChangeddAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre("save", async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the confirmPassword field;
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passworChangeddAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passworChangeddAt) {
    const changedTimestamp = parseInt(
      this.passworChangeddAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

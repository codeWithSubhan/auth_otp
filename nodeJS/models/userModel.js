const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowerCase: true,
      required: [true, "Please provide your email!"],
      validate: [validator.isEmail, "Please provide valid email!"],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: 4,
      required: [true, "Please provide a password!"],
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Please tell us your name!"],
    },
    contact: {
      type: String,
      trim: true,
      minLength: [10, "number should have minimum 10 digits"],
      maxLength: [10, "number should have maximum 10 digits"],
      match: [/\d{10}/, "number should only have digits"],
    },
    photo: {
      type: String,
      default: "default.png",
    },
    passwordChangedAt: Date,
    encryptedOTP: String,
    expiredOTP: Date,
  },
  {
    strict: true, // Ensure only schema fields are saved
  }
);

userSchema.pre("save", async function (next) {
  //run on save(), create(), etc.
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("save", async function (next) {
  //run on save(), create(), etc.
  console.log(this.isModified("password"), this.isNew);

  // return if user is new
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (pass, dbPass) {
  return await bcrypt.compare("" + pass, dbPass);
};

userSchema.methods.changePasswordAfter = async function (JWTTimestamp) {
  // if not passwordChangedAt property means no password changed 🤷‍♂️
  if (!this.passwordChangedAt) return false;

  //convert passwordChangedAt to miliseconds
  const changedTimeStamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return JWTTimestamp < changedTimeStamp;
  // if pass has change it means jwt'TimeStamps must greater or same than pass
  // because both passAt and jwt is created but we explicity less -1000 from passchangeAt

  // console.log(JWTTimestamp, changedTimeStamp);
  // isOld token using and password changed it is an error
};

userSchema.methods.generateOTP = function () {
  const OTP = Math.floor(1000 + Math.random() * 9000).toString();

  // Encrypt the OTP and save to the database
  this.encryptedOTP = crypto.createHash("sha256").update(OTP).digest("hex");

  console.log(OTP, this.encryptedOTP);

  // Set token expiry time (10 minutes)
  this.expiredOTP = Date.now() + 10 * 60 * 1000;

  // Return the plain text token to send to the user
  return OTP;
};

const User = mongoose.model("User", userSchema);

// User.createIndexes();       //insure that uniqu work, don't use in middle
module.exports = User;

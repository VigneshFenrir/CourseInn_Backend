const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confrim_password: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
});

const UserModel = mongoose.model("user", userschema);

module.exports = UserModel;

const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
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
  repaeat_password: {
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
});

const UserModel = mongoose.model("user", userschema);

module.exports = UserModel;

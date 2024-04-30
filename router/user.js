const express = require("express");
router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/Users");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const generateOTP = require("./otp");
const _ = require("lodash");

const smtpConfig = {
  host: "smtp.hostinger.com", // Replace with your actual SMTP server hostname
  port: 465, // Common port for secure SMTP (SSL/TLS)
  secure: true, // Use secure connection
  auth: {
    user: "academy@hilltotown.com", // Replace with your SMTP username
    pass: "Academy@2024!", // Replace with your SMTP password
  },
};

const transporter = nodemailer.createTransport(smtpConfig);

// Define email options

// to get the data
const itemperpage = 10;
router.get("/", async (req, res) => {
  const pageno = req.query.page;
  const skip = (pageno - 1) * itemperpage;
  const geter = await UserModel.find().limit(itemperpage).skip(skip);
  res.json(geter);
});

router.get("/total", async (req, res) => {
  const geter = await UserModel.find().count();
  res.json(geter);
});

// find and get data

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id).select("-_id -__v -date ");
    if (!user)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});
// to request & response to the api and database /  signin

router.post("/signinusers", async (req, res) => {
  try {
    const { error } = validatelogining(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) return res.status(400).send("user already exits ");

    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("Passwords Doesn't Match");
    }
    const User = new UserModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
      role: req.body.role,
    });
    const salt = await bcrypt.genSalt(15);
    const hashed = await bcrypt.hash(req.body.password, salt);

    User.password = hashed;

    const result = await User.save();
    console.log(result);
    const token = User.generateToken();
    res.header("x-auth-token", token).send("created successfully");
    // res.send(_.pick(User, ["password"]));
  } catch (error) {
    console.log(error);
  }
});

// to request & response to the api and database /  forget password find the email and generate otp
router.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const forgetpwd = await UserModel.findOne({ email });
    if (!forgetpwd) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Mail Id" });
    }
    const otp = generateOTP();
    forgetpwd.resetPasswordOTP = otp;
    forgetpwd.otp = otp;
    console.log("Generated OTP:", otp);
    const mailOptions = {
      from: "academy@hilltotown.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `<p>Your OTP for password reset is: ${otp}
      Please use this OTP to reset your password.`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    const forget = await forgetpwd.save();
    console.log(forget);
    const resp = {
      success: true,
      email: forgetpwd.email,
    };

    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// to request & response to the api and database /  verify otp

router.post("/verifyotp", async (req, res) => {
  const { otp } = req.body;
  try {
    const verifyotp = await UserModel.findOne({ otp });
    if (!verifyotp) {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }
    const resp = {
      success: true,
      userid: verifyotp._id,
    };
    res.send(resp);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

router.put("/updatepassword/:id", async (req, res) => {
  const { password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json("Passwords Doesn't match");
  }

  try {
    const updatepassword = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        password: req.body.password,
      },
      { new: true }
    );
    console.log(updatepassword);
    if (!updatepassword) return res.status(400).send("error");
    res.send("Password Updated Successfully");
  } catch (err) {
    console.log(err);
  }
});

router.put("/signinusers/:id", async (req, res) => {
  // handling the err for the joi
  const { error } = validatelogining(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  try {
    const { password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(400).json("Passwords Doesn't Match");
    }
    const userss = await UserModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        role: req.body.role,
      },

      { new: true }
    );
    console.log(userss);

    // In case dosen't match to it will be handle the error
    if (!userss)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send("Updated Successfully");
  } catch (err) {
    console.log(err);
  }
});

// delete the data

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const userss = await UserModel.findByIdAndDelete(id);
    console.log(userss);
    if (!userss)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(" Deleted successfully!");
  } catch (err) {
    console.log(err.message);
  }
});

// joi and validation function

function validatelogining(Logining) {
  const Schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string(),
    role: Joi.string().required(),
  });
  const result = Schema.validate(Logining);
  return result;
}

module.exports = router;

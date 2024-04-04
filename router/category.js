const express = require("express");

router = express.Router();

const UserModel = require("../models/Users");
const Joi = require("joi");

// to get the data
router.get("/signinusers", async (req, res) => {
  const category = await UserModel.find();
  res.send(category);
});
// to request & response to the api and database /  signin

router.post("/signinusers", async (req, res) => {
  const poster = new UserModel(req.body);
  const result = await poster.save();
  console.log(result);
  res.send(result);
});

// to request & response to the api and database /  login

router.post("/loginusers", async (req, res) => {
  // handling the err for the joi

  const { error } = validatelogining(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, password } = req.body;
  const Logining = await UserModel.findOne({ email, password });
  console.log(Logining);
  // In case dosen't match to it will be handle the error
  if (!Logining) {
    return res.status(400).send({ message: "Invalid Email & password" });
  }

  res.send("Logining Successfully");
});

// joi and validation function

function validatelogining(Logining) {
  const Schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = Schema.validate(Logining);
  return result;
}
module.exports = router;

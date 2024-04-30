const express = require("express");
router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("./models/Users");
const Joi = require("joi");

// console.log(config.get("jwtpvtkey"));

// to request & response to the api and database /  login

router.post("/", async (req, res) => {
  // handling the err for the joi

  try {
    const { error } = validatelogin(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = req.body;
    const User = await UserModel.findOne({ email });

    console.log(User);
    // In case dosen't match to it will be handle the error

    if (!User) {
      return res.status(400).send("Invalid email or password");
    }

    //bcrypt.compare(password, User.password);

    const valid_passwd = await bcrypt.compare(password, User.password);
    console.log(valid_passwd);

    if (!valid_passwd) return res.status(400).send("Invalid  password");

    // const token = jwt.sign({ _id: User.id }, config.get("jwtpvtkey"));

    const token = User.generateToken();

    res.header("x-auth-token", token).send("Logining Successfully");
  } catch (err) {
    console.log(err);
  }
});

function validatelogin(Logining) {
  const Schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  const result = Schema.validate(Logining);
  return result;
}

module.exports = router;

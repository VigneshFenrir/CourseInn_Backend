const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("./models/Users");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

// POST /login - User login endpoint
router.post("/", async (req, res) => {
  try {
    // Validate request body
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");
    console.log(user, "Usersss");

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).send("Invalid password");

    // Generate token
    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      config.get("jwtpvtkey"),
      {
        expiresIn: "1h",
      }
    );

    res.setHeader("X-Auth-Token", token);

    res.status(200).send("Login successful");
    console.log("tokenssset", token);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Validate login request body
function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().email().required(), // Added email format validation
    password: Joi.string().min(6).required(), // Minimum length for password
  });
  return schema.validate(data);
}

module.exports = router;

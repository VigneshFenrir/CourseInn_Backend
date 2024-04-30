const express = require("express");
router = express.Router();
const UserModel = require("../models/Users");
const authM = require("../middeware/authM");

router.get("/", authM, async (req, res) => {
  // req.user_id

  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

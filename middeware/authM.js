const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function authM(req, res, next) {
  const token = req.header("X-Auth-Token");
  console.log(token);
  if (!token) return res.status(401).send("Access denied , No Token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtpvtkey"));

    req.user = decoded;
    console.log(decoded, "decoded");
    console.log(req.user, "users");
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
  next();
};

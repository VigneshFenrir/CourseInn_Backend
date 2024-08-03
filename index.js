const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const _ = require("lodash");
const User = require("./router/user");
const Course = require("./router/course");
const trainer = require("./router/trainer");
const batch = require("./router/batch");
const student = require("./router/student");
const opp = require("./router/operation");
const login = require("./auth");
const currentUser = require("./router/currentUser");

if (!config.get("jwtpvtkey")) {
  console.log("FATAL ERROR ,jwtpvtkey is not defined ");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost:27017/loginusers")
  .then(() => {
    console.log("Mongodb connetced");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["X-Auth-Token"],
  })
);
app.use(express.json());

app.use("/academy", User);
app.use("/courses", Course);
app.use("/trainers", trainer);
app.use("/batches", batch);
app.use("/students", student);
app.use("/operations", opp);
app.use("/academy/loginuser", login);
app.use("/me", currentUser);

const port = 5000;
app.listen(port, () => {
  console.log(`server listening the port ${port}`);
});

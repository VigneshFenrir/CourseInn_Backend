const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Category = require("./router/category");
const Course = require("./router/course");
const trainer = require("./router/trainer");
const batch = require("./router/batch");
const student = require("./router/student");

mongoose
  .connect("mongodb://localhost:27017/loginusers")
  .then(() => {
    console.log("Mongodb connetced");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/academy", Category);
app.use("/course", Course);
app.use("/trainer", trainer);
app.use("/batch", batch);
app.use("/student", student);

const port = 5000;
app.listen(port, () => {
  console.log(`server listening the port ${port}`);
});

const mongoose = require("mongoose");

const courseschema = new mongoose.Schema({
  coursename: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

const CourseModel = mongoose.model("course", courseschema);

module.exports.CourseModel = CourseModel;
module.exports.courseschema = courseschema;

const mongoose = require("mongoose");
const { batchschema } = require("../models/batches");
const { courseschema } = require("./courses");

const studentschema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  student_name: {
    type: String,
    required: true,
  },
  student_email: {
    type: String,
    required: true,
  },
  student_mobile: {
    type: String,
    required: true,
  },
  student_address: {
    type: String,
    required: true,
  },
  student_education: {
    type: String,
    required: true,
  },
  batches: {
    type: batchschema,
    required: true,
  },
  course: {
    type: courseschema,
    required: true,
  },
});

const StudentModel = mongoose.model("student", studentschema);

module.exports.StudentModel = StudentModel;

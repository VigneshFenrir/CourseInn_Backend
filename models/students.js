const mongoose = require("mongoose");
const { batchschema } = require("../models/batches");

const studentschema = new mongoose.Schema({
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
});

const StudentModel = mongoose.model("student", studentschema);

module.exports.StudentModel = StudentModel;

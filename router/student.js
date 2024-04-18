const express = require("express");
router = express.Router();
const Joi = require("joi");
const { StudentModel } = require("../models/students");
const { BatchModel } = require("../models/batches");

// get the data to datebase

const itemPerPage = 8;
router.get("/", async (req, res) => {
  const pageNo = req.query.page;
  const skip = (pageNo - 1) * itemPerPage;
  // console.log(pageNo, " -- ", skip);
  const item = await StudentModel.find().limit(itemPerPage).skip(skip);

  res.send(item);
});

router.get("/total", async (req, res) => {
  const item = await StudentModel.find().count();
  console.log(item);
  res.json(item);
});

// find and get data

router.get("/:id", async (req, res) => {
  const { id } = req.prams.id;
  try {
    const student = await StudentModel.findById({ _id: id });
    if (!student)
      return res
        .status(404)
        .send("The student with the given ID was not found.");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

// to request & response to the api and database

router.post("/", async (req, res) => {
  // handling the err for the joi

  const { error } = validatestudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const batches = await BatchModel.findById(req.body.batchid);

  // In case dosen't match to it will be handle the error

  if (!batches) return res.status(400).send("invalid batch");

  // constructor function to create new

  const students = new StudentModel({
    student_name: req.body.student_name,
    student_email: req.body.student_email,
    student_mobile: req.body.student_mobile,
    student_address: req.body.student_address,
    student_education: req.body.student_education,
    date: req.body.date,
    batches: {
      _id: batches._id,
      batchname: batches.batchname,
      start_time: batches.start_time,
      end_time: batches.end_time,
      trainer: batches.trainer,
    },
  });
  const student = await students.save();
  console.log(student);
  res.send("Created Successfully");
});

//   update the data to database

router.put("/:id", async (req, res) => {
  // handling the err for the joi

  const { error } = validatebatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const batches = await TrainerModel.findById(req.body.batchid);

  // In case dosen't match to it will be handle the error

  if (!batches) return res.status(400).send("invalid trainer");

  const students = await StudentModel.findByIdAndUpdate(
    req.params.id,
    {
      student_name: req.body.student_name,
      student_email: req.body.student_email,
      student_mobile: req.body.student_mobile,
      student_address: req.body.student_address,
      student_education: req.body.student_education,
      date: req.body.date,
      batches: {
        _id: batches._id,
        batchname: batches.batchname,
        start_time: batches.start_time,
        end_time: batches.end_time,
        trainer: batches.trainer,
      },
    },
    { new: true }
  );
  if (!students)
    // In case dosen't match to it will be handle the error

    return res.status(404).send("The student with the given ID was not found.");
  res.send("Updated Successfully");
});

// delete the data

router.delete("/:id", async (req, res) => {
  const students = await StudentModel.findByIdAndDelete(req.params.id);
  // In case dosen't match to it will be handle the error

  if (!students)
    return res.status(404).send("The student with the given ID was not found.");
  res.send(" Deleted successfully!");
});
// joi and validation function

function validatestudent(students) {
  const Schema = Joi.object({
    student_name: Joi.string().min(3).required(),
    student_email: Joi.string().required(),
    student_mobile: Joi.string().required(),
    student_address: Joi.string().required(),
    student_education: Joi.string().required(),
    batchid: Joi.string().required(),
  });
  result = Schema.validate(students);

  return result;
}

module.exports = router;

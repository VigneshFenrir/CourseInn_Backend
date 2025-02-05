const express = require("express");
router = express.Router();
const Joi = require("joi");
const authM = require("../middeware/authM");
const { StudentModel } = require("../models/students");
const { BatchModel } = require("../models/batches");
const { CourseModel } = require("../models/courses");

// get the data to datebase

const itemPerPage = 10;
router.get("/", async (req, res) => {
  try {
    const batchid = req.query.batch;
    const courseid = req.query.course;
    const pageNo = req.query.page;
    const skip = (pageNo - 1) * itemPerPage;
    if (req.query.batch || req.query.course) {
      console.log("hiiiiiiiii");
      console.log(batchid, "hiii");

      let batch = "";
      let course = "";

      if (req.query.batch) {
        const batches = await BatchModel.findById(batchid);
        console.log("orrrrrrrrr", batches);
        batch = new RegExp(`.*${batches.batchname}.*`);
        console.log(batch, "batch");
      }

      if (req.query.course) {
        const Courses = await CourseModel.findById(courseid);
        course = new RegExp(`.*${Courses.coursename}.*`);
        console.log(course, "course");
      }

      const geter = await StudentModel.find({
        $or: [{ "batches.batchname": batch }, { "course.coursename": course }],
      })
        .limit(itemPerPage)
        .skip(skip);

      res.send(geter);
      console.log(geter);
    }

    if (req.query.batch && req.query.course) {
      // console.log(batchid);
      const batches = await BatchModel.findById(batchid);
      console.log("ss", batches);
      const Courses = await CourseModel.findById(courseid);
      const batch = new RegExp(`.*${batches.batchname}.*`);
      console.log(batch, "batch");
      const course = new RegExp(`.*${Courses.coursename}.*`);
      console.log(course, "course");
      const geter = await StudentModel.find({
        $and: [
          { "batches.batchname": batch },
          { "course.coursename": course },
          // Add more conditions as needed
        ],
      })
        .limit(itemPerPage)
        .skip(skip);

      res.send("hii daa");
      console.log(geter);
    } else {
      const geter = await StudentModel.find().limit(itemPerPage).skip(skip);
      res.send(geter);
    }
    // console.log(search);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/total", async (req, res) => {
  const item = await StudentModel.find().count();
  console.log(item);
  res.json(item);
});

// find and get data

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await StudentModel.findById(id);
    if (!student)
      return res
        .status(404)
        .send("The student with the given ID was not found.");
    res.send(student);
  } catch (err) {
    console.log(err.message);
  }
});

// to request & response to the api and database

router.post("/", authM, async (req, res) => {
  // handling the err for the joi

  const { error } = validatestudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const batches = await BatchModel.findById(req.body.batchid);
  const course = await CourseModel.findById(req.body.courseid);

  // In case dosen't match to it will be handle the error

  if (!batches) return res.status(400).send("invalid batch");
  if (!course) return res.status(400).send("invalid course");

  // constructor function to create new

  const students = new StudentModel({
    student_name: req.body.student_name,
    student_email: req.body.student_email,
    student_mobile: req.body.student_mobile,
    student_address: req.body.student_address,
    student_education: req.body.student_education,
    date: req.body.date,
    course: {
      _id: course._id,
      coursename: course.coursename,
      duration: course.duration,
    },
    batches: {
      _id: batches._id,
      batchname: batches.batchname,
      start_time: batches.start_time,
      end_time: batches.end_time,
      trainer: batches.trainer,
    },
    course: {
      coursename: course.coursename,
      duration: course.duration,
    },
  });
  const student = await students.save();
  console.log(student);
  res.send("Created Successfully");
});

//   update the data to database

router.put("/:id", authM, async (req, res) => {
  // handling the err for the joi

  const { error } = validatestudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const batches = await BatchModel.findById(req.body.batchid);
  const course = await CourseModel.findById(req.body.courseid);

  // In case dosen't match to it will be handle the error

  if (!batches) return res.status(400).send("invalid batch");
  if (!course) return res.status(400).send("invalid course");

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
      course: {
        coursename: course.coursename,
        duration: course.duration,
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

router.delete("/:id", authM, async (req, res) => {
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
    courseid: Joi.string().required(),
  });
  result = Schema.validate(students);

  return result;
}

module.exports = router;

const express = require("express");

router = express.Router();

const { TrainerModel } = require("../models/trainers");
const { CourseModel } = require("../models/courses");
const Joi = require("joi");

// get the data to datebase

router.get("/users", async (req, res) => {
  const geter = await trainers.find();
  res.send(geter);
});

// find and get data

router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await TrainerModel.findById({ _id: id });
    if (!user)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

// to request & response to the api and database

router.post("/users", async (req, res) => {
  // handling the err for the joi

  const { error } = validateTrainer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await CourseModel.findById(req.body.courseid);
  // In case dosen't match to it will be handle the error

  if (!course) return res.status(400).send("invalid course");
  // constructor function to create new

  const trainer = new TrainerModel({
    tname: req.body.tname,
    email: req.body.email,
    mobile: req.body.mobile,
    course: {
      _id: course._id,
      coursename: course.coursename,
      duration: course.duration,
    },
  });
  const training = await trainer.save();
  res.send(training);
});

//   update the data to database

router.put("/users/:id", async (req, res) => {
  // handling the err for the joi

  const { error } = validateTrainer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await CourseModel.findById(req.body.courseid);
  // In case dosen't match to it will be handle the error

  if (!course) return res.status(400).send("invalid course");

  const trainer = await TrainerModel.findByIdAndUpdate(
    req.params.id,
    {
      tname: req.body.tname,
      email: req.body.email,
      mobile: req.body.mobile,
      course: {
        _id: course._id,
        coursename: course.coursename,
        duration: course.duration,
      },
    },
    { new: true }
  );
  // In case dosen't match to it will be handle the error

  if (!trainer)
    return res.status(404).send("The trainer with the given ID was not found.");
  res.send(trainer);
});
// delete the data

router.delete("/users/:id", async (req, res) => {
  const trainer = await TrainerModel.findByIdAndDelete(req.params.id);
  // In case dosen't match to it will be handle the error

  if (!trainer)
    return res.status(404).send("The trainer with the given ID was not found.");
  res.send(trainer);
});
// joi and validation function

function validateTrainer(trainer) {
  const Schema = Joi.object({
    tname: Joi.string().min(3).required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    courseid: Joi.string().required(),
  });
  result = Schema.validate(trainer);
  return result;
}

module.exports = router;

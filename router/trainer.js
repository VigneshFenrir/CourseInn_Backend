const express = require("express");
router = express.Router();
const authM = require("../middeware/authM");
const { TrainerModel } = require("../models/trainers");
const { CourseModel } = require("../models/courses");
const Joi = require("joi");

// get the data to datebase
const itemperpage = 10;
router.get("/", async (req, res) => {
  const pageno = req.query.page;
  const skip = (pageno - 1) * itemperpage;
  const geter = await TrainerModel.find().limit(itemperpage).skip(skip);
  res.json(geter);
});

router.get("/total", async (req, res) => {
  const geter = await TrainerModel.find().count();
  res.json(geter);
});

// find and get data

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await TrainerModel.findById(id).select(
      "-_id -__v -date -course"
    );
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

router.post("/", authM, async (req, res) => {
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
    date: req.body.date,
    course: {
      _id: course._id,
      coursename: course.coursename,
      duration: course.duration,
    },
  });
  const training = await trainer.save();
  console.log(training);
  res.send("Created Successfully");
});

//   update the data to database

router.put("/:id", authM, async (req, res) => {
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
      date: req.body.date,
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
  res.send("Updated Successfully");
});
// delete the data

router.delete("/:id", authM, async (req, res) => {
  const trainer = await TrainerModel.findByIdAndDelete(req.params.id);
  // In case dosen't match to it will be handle the error

  if (!trainer)
    return res.status(404).send("The trainer with the given ID was not found.");
  res.send(" Deleted successfully!");
});
// joi and validation function

function validateTrainer(trainer) {
  const Schema = Joi.object({
    tname: Joi.string().min(3).required(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    courseid: Joi.string().required(),
    // duration: Joi.string().required(),
  });
  result = Schema.validate(trainer);
  return result;
}

module.exports = router;

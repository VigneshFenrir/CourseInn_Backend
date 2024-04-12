const express = require("express");

router = express.Router();

const { CourseModel } = require("../models/courses");
const Joi = require("joi");

// get the data to datebase
const itemPerPage = 8;
router.get("/users", async (req, res) => {
  const pageNo = req.query.page;
  const skip = (pageNo - 1) * itemPerPage;
  console.log(pageNo, " -- ", skip);
  const item = await CourseModel.find().limit(itemPerPage).skip(skip);

  res.send(item);
});

// count
router.get("/users/total", async (req, res) => {
  const item = await CourseModel.find().count();
  console.log(item);
  res.json(item);
});

// find and get data
router.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await CourseModel.findById(id).select("-_id -__v");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/users", async (req, res) => {
  // handling the err for the joi
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const coursess = new CourseModel(req.body);
  courses = await coursess.save();
  console.log(courses);
  res.send("created successfully");
});

//   update the data to database

router.put("/users/:id", async (req, res) => {
  // handling the err for the joi
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  const coursess = await CourseModel.findByIdAndUpdate(
    id,
    {
      coursename: req.body.course_name,
      duration: req.body.duration,
    },

    { new: true }
  );
  console.log(coursess);

  // In case dosen't match to it will be handle the error
  if (!coursess)
    return res.status(404).send("The course with the given ID was not found.");
  res.send(coursess);
});

// delete the data

router.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const coursess = await CourseModel.findByIdAndDelete(id);
    console.log(coursess);
    if (!coursess)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(coursess);
  } catch (err) {
    console.log(err.message);
  }
});

// joi and validation function

function validateCourse(coursess) {
  const Schema = Joi.object({
    coursename: Joi.string().min(3).required(),
    duration: Joi.string().required(),
  });
  result = Schema.validate(coursess);
  return result;
}

module.exports = router;

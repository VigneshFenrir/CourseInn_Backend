const express = require("express");

router = express.Router();

const { CourseModel } = require("../models/courses");
const Joi = require("joi");

// get the data to datebase
const itemPerPage = 8;
router.get("/", async (req, res) => {
  const pageNo = req.query.page;
  const skip = (pageNo - 1) * itemPerPage;
  // console.log(pageNo, " -- ", skip);
  const item = await CourseModel.find().limit(itemPerPage).skip(skip);

  res.send(item);
});

// count

router.get("/total", async (req, res) => {
  const item = await CourseModel.find().count();
  console.log(item);
  res.json(item);
});
// find and get data
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await CourseModel.findById(id).select("-_id -__v -date");
    res.send(user);
  } catch (err) {
    console.log(err.message);
  }
});

// to request & response to the api and database

router.post("/", async (req, res) => {
  // handling the err for the joi
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const coursess = new CourseModel(req.body);

  courses = await coursess.save();
  console.log(courses);
  res.send("Created SucCessfully");
});

//   update the data to database

router.put("/:id", async (req, res) => {
  // handling the err for the joi
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const id = req.params.id;

  const coursess = await CourseModel.findByIdAndUpdate(
    id,
    {
      coursename: req.body.coursename,
      duration: req.body.duration,
    },

    { new: true }
  );
  console.log(coursess);

  // In case dosen't match to it will be handle the error
  if (!coursess)
    return res.status(404).send("The course with the given ID was not found.");
  res.send("Updated Successfully");
});

// delete the data

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const coursess = await CourseModel.findByIdAndDelete(id);
    console.log(coursess);
    if (!coursess)
      return res
        .status(404)
        .send("The course with the given ID was not found.");
    res.send(" Deleted successfully!");
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

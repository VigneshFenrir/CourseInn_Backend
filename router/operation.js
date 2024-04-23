const express = require("express");

router = express.Router();

const { CourseModel } = require("../models/courses");
const { StudentModel } = require("../models/students");
const { BatchModel } = require("../models/batches");
const { TrainerModel } = require("../models/trainers");

let graph = {
  course: "",
  stud: "",
  btch: "",
  train: "",
};
// get the count
router.get("/", async (req, res) => {
  const geter = await CourseModel.find().count();
  const item = await StudentModel.find().count();
  const batch = await BatchModel.find().count();
  const trainer = await TrainerModel.find().count();
  graph = { course: geter, stud: item, btch: batch, train: trainer };
  res.json(graph);
});

module.exports = router;

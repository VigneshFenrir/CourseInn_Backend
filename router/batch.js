const express = require("express");
router = express.Router();
const Joi = require("joi");
const { BatchModel } = require("../models/batches");
const { TrainerModel } = require("../models/trainers");

// get the data to datebase
router.get("/", async (req, res) => {
  const geter = await BatchModel.find();
  res.send(geter);
});

// find and get data
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await BatchModel.findById(id).select(
      "-_id -__v -date -trainer "
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
router.post("/", async (req, res) => {
  // handling the err for the joi

  const { error } = validatebatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const trainer = await TrainerModel.findById(req.body.trainerid);
  if (!trainer) return res.status(400).send("invalid trainer");

  // constructor function to create new

  const batched = new BatchModel({
    batchname: req.body.batchname,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    date: req.body.date,
    trainer: {
      _id: trainer._id,
      tname: trainer.tname,
      email: trainer.email,
      mobile: trainer.mobile,

      course: trainer.course,
    },
  });
  const batches = await batched.save();
  console.log(batches);
  res.send("Created Successfully");
});

//   update the data to database
router.put("/:id", async (req, res) => {
  // handling the err for the joi

  const { error } = validatebatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const trainer = await TrainerModel.findById(req.body.trainerid);
  if (!trainer) return res.status(400).send("invalid trainer");

  const batches = await BatchModel.findByIdAndUpdate(
    req.params.id,
    {
      batchname: req.body.batchname,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      date: req.body.date,
      trainer: {
        _id: trainer._id,
        tname: trainer.tname,
        email: trainer.email,
        mobile: trainer.mobile,
        course: trainer.course,
      },
    },
    { new: true }
  );

  // In case dosen't match to it will be handle the error
  if (!batches)
    return res.status(404).send("The batch with the given ID was not found.");
  res.send("Updated Successfully");
});

//   Delete the data to database

router.delete("/:id", async (req, res) => {
  const batches = await BatchModel.findByIdAndDelete(req.params.id);

  // In case dosen't match to it will be handle the error
  if (!batches)
    return res.status(404).send("The batch with the given ID was not found.");
  res.send(" Deleted successfully!");
});
// joi and validation function
function validatebatch(batched) {
  const Schema = Joi.object({
    batchname: Joi.string().min(3).required(),
    start_time: Joi.string().required(),
    end_time: Joi.string().required(),
    trainerid: Joi.string().required(),
  });
  result = Schema.validate(batched);
  return result;
}

module.exports = router;

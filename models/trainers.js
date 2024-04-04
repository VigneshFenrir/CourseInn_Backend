const mongoose = require("mongoose");
const { courseschema } = require("./courses");

const trainerschema = new mongoose.Schema({
  tname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  course: {
    type: courseschema,
    required: true,
  },
});

const TrainerModel = mongoose.model("trainer", trainerschema);

module.exports.TrainerModel = TrainerModel;
module.exports.trainerschema = trainerschema;

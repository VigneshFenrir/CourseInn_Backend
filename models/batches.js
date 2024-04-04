const mongoose = require("mongoose");
const { trainerschema } = require("./trainers");

const batchschema = new mongoose.Schema({
  batchname: {
    type: String,
    required: true,
  },
  start_time: {
    type: String,
    required: true,
  },
  end_time: {
    type: String,
    required: true,
  },
  trainer: {
    type: trainerschema,
    required: true,
  },
});

const BatchModel = mongoose.model("batch", batchschema);

module.exports.BatchModel = BatchModel;
module.exports.batchschema = batchschema;

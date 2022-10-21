const mongoose = require("mongoose");

const extraClassSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.ObjectId, required: true },
  hall_id: { type: mongoose.Schema.ObjectId, required: true },
  date: { type: Date, default: Date.now, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  requestStatus: { type: String, required: true },
});

module.exports = mongoose.model("extraClass", extraClassSchema);

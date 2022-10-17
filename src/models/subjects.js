const { boolean } = require("joi");
const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_id: { type: String, required: true },
  subject_name: { type: String, required: true },
  isAdmition: { type: Boolean, required: true },
  admition: { type: Number, required: true },
  fees: { type: Number, required: true },
  category_id: { type: mongoose.Schema.ObjectId, required: true },
  teacher_id: { type: mongoose.Schema.ObjectId },
  hall_id: { type: mongoose.Schema.ObjectId },
  classDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

module.exports = mongoose.model("subject", subjectSchema);

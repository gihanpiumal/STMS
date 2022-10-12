const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_id: { type: String, required: true },
  subject_name: { type: String, required: true },
  category_id: { type: mongoose.Schema.ObjectId, required: true },
  teacher_id: { type: mongoose.Schema.ObjectId, required: true },
  classDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

module.exports = mongoose.model("subject", subjectSchema);

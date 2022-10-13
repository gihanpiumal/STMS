const { boolean } = require("joi");
const mongoose = require("mongoose");

const studentSubjectSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.ObjectId, required: true },
  subject_id: { type: mongoose.Schema.ObjectId, required: true },
  enrollDate: { type: Date, default: Date.now, required: true },
  tempStopDate: { type: Date, default: Date.now,  },
  admition: { type: Boolean, required: true },
  studentAccess: { type: Boolean, required: true },
  reasonForStop: { type: String, },
});

module.exports = mongoose.model("studentSubject", studentSubjectSchema);

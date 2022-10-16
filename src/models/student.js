const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  //   student_id: { type: mongoose.Schema.ObjectId, required: true },

  student_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  DOB: { type: Date, default: Date.now, required: true },
  NIC: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String },
  password: { type: String, required: true },
  registeredDate: { type: Date, default: Date.now, required: true },
  category_id: { type: mongoose.Schema.ObjectId, required: true },
  subject_list: [{ type: String, required: true }],
  access_level: { type: String, required: true },
  access_status: { type: String, required: true },
  isVerified: { type: Boolean, required: true, default: false },
  OTPCode: { type: Number },
});

module.exports = mongoose.model("students", studentSchema);

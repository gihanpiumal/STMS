const mongoose = require("mongoose");

const teacherPaymentSchema = new mongoose.Schema({
  teacher_id: { type: String, required: true },
  subject_id: { type: String, required: true },
  year: { type: String, required: true },
  month: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  studentCount: { type: Number, required: true },
  paymentState: { type: String, required: true },
});

module.exports = mongoose.model("teacherPayment", teacherPaymentSchema);

const { boolean } = require("joi");
const mongoose = require("mongoose");

const subjectPaymentSchema = new mongoose.Schema({
  subject_id: { type: String, required: true },
  teacher_id: { type: String, required: true },
  year: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  student_count: { type: Number, required: true },
  paid_student_count: { type: Number, required: true },
  pending_payment_student_count: { type: Number, required: true },
  pending_amount: { type: Number, required: true },
});

module.exports = mongoose.model("subjectPayment", subjectPaymentSchema);

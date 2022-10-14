const { boolean } = require("joi");
const mongoose = require("mongoose");

const studentPaymentSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.ObjectId, required: true },
  subject_id: { type: mongoose.Schema.ObjectId, required: true },
  staff_member_id: { type: mongoose.Schema.ObjectId, required: true },
  year: { type: String, required: true },
  month: { type: String, required: true },
  PaymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  payment_state: { type: Boolean, required: true },
});

module.exports = mongoose.model("studentPayment", studentPaymentSchema);

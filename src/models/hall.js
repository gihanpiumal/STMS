const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  hall_name: { type: String, required: true },
});

module.exports = mongoose.model("hall", hallSchema);

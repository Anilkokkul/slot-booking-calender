const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: Date, required: true }, // HH:MM
  endTime: { type: Date, required: true }, // HH:MM
  name: {
    type: String,
  },
  email: String,
  mobileNumber: String,
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("slots", slotSchema);

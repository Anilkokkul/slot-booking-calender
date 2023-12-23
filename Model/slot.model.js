const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true, unique: true }, // HH:MM
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

const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Regex to validate time format (HH:MM AM/PM)
        return /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid time format!`,
    },
  },
  service: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["spa", "home service"],
    required: true,
  },
});
module.exports = mongoose.model("Appointment", AppointmentSchema);

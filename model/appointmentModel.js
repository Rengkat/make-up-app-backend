const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
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
  status: {
    type: String,
    enum: ["pending", "delivered", "cancelled"],
    default: "pending",
  },
  notes: {
    type: String,
    maxlength: 500, // Optional field for any additional notes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookingSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("Appointment", AppointmentSchema);

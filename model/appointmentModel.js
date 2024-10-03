const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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
    enum: [
      "Swedish Massage",
      "Deep Tissue Massage",
      "Hot Stone Massage",
      "Aromatherapy Massage",
      "Thai Massage",
      "Shiatsu Massage",
      "Reflexology Massage",
      "Prenatal Massage",
      "Sports Massage",
      "Oxygen Facials",
      "LED Facials",
      "Microdermabrasion Facials",
      "Chemical Peel Facials",
      "Anti-Aging Facials",
      "Hydrating Facials",
      "Acne Treatment Facials",
      "Body Mud Masks",
      "Body Wraps",
      "Sauna Relax",
      "Detoxifying Body Treatments",
      "Nutritionist Consultation",
      "Facials and Hand Manicure Only",
      "Facials and Toe Manicure Only",
      "Facials, Hand and Toe Manicure",
      "Only Facials",
      "Basic Manicure",
      "Spa Manicure",
      "Gel Manicure",
      "Nail Art",
      "Basic Pedicure",
      "Spa Pedicure",
      "Paraffin Wax Treatment",
      "Bridal Makeup",
      "Event Makeup",
      "Day Makeup",
      "Evening Makeup",
      "Makeup Consultation",
      "Eyebrow Shaping",
      "Eyelash Extensions",
      "Brow and Lash Tinting",
      "Makeup Lesson",
    ],
    required: true,
  },
  address: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    town: { type: String },
    landmark: { type: String },
    homeAddress: { type: String, required: true },
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AppointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model("Appointment", AppointmentSchema);

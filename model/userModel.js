const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const AddressSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  town: { type: String },
  landmark: { type: String },
  homeAddress: { type: String, required: true },
});
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name can't be empty"],
    },
    surname: {
      type: String,
      required: [true, "Surname can't be empty"],
    },
    email: {
      type: String,
      required: [true, "Email can't be empty"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password can't be empty"],
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message: "Enter a stronger password",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.surname}`;
});
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);

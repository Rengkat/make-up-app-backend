const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
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
      message: "Password must be stronger",
    },
  },
});

module.exports = mongoose.model("User", UserSchema);

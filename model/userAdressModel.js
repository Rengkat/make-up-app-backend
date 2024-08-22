const mongoose = require("mongoose");
const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  town: { type: String },
  landmark: { type: String },
  homeAddress: { type: String, required: true },
});

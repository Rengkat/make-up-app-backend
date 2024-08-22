const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide a product"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);

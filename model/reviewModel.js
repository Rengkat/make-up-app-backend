const mongoose = require("mongoose");
const ReviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please add a comment"],
      maxLength: [200, "Comment should be brief"],
    },
    rating: {
      type: Number,
      required: [true, "Please rate the product"],
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      requires: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    timeS,
  },
  { timestamps: true }
);
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
module.exports = mongoose.model("Review", ProductSchema);

const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      default: 1, // Set default quantity to 1
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating total amount
CartSchema.virtual("totalAmount").get(function () {
  return this.product.price * this.quantity;
});

module.exports = mongoose.model("Cart", CartSchema);

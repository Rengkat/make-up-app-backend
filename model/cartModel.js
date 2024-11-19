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
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating sub-total amount
CartSchema.virtual("subTotalAmount").get(function () {
  return this.product.price * this.quantity;
});

module.exports = mongoose.model("Cart", CartSchema);

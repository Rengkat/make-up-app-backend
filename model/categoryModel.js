const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a category name"],
    unique: true,
    trim: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

CategorySchema.index({ name: 1 });

module.exports = mongoose.model("Category", CategorySchema);

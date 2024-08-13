const express = require("express");
const {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");
const router = express.Router();
router.post("/", addCategory);
router.get("/", getAllCategories);
router.route("/:id").get(getSingleCategory).patch(updateCategory).delete(deleteCategory);
module.exports = router;

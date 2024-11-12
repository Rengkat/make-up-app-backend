const express = require("express");
const {
  addCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
  updateCategory,
} = require("../controller/categoryController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router.post("/", authenticateUser, authorizationPermission, addCategory);
router.get("/", getAllCategories);
router
  .route("/:id")
  .get(getSingleCategory)
  .delete(authenticateUser, authorizationPermission, deleteCategory)
  .patch(authenticateUser, authorizationPermission, updateCategory);
module.exports = router;

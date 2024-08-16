const express = require("express");
const {
  addCategory,
  getAllCategories,
  getSingleCategory,
  deleteCategory,
} = require("../controller/categoryController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router.post("/", authenticateUser, authorizationPermission, addCategory);
router.get("/", getAllCategories);
router
  .route("/:id")
  .get(getSingleCategory)
  .delete(authenticateUser, authorizationPermission, deleteCategory);
module.exports = router;

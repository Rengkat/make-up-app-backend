const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizationPermission, createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizationPermission, updateProduct)
  .delete(authenticateUser, authorizationPermission, deleteProduct);

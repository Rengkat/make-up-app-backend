const express = require("express");
const {
  addBrand,
  getAllBrands,
  getSingleBrand,
  deleteBrand,
  updateBrand,
} = require("../controller/brandController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router.post("/", authenticateUser, authorizationPermission, addBrand);
router.get("/", getAllBrands);
router
  .route("/:id")
  .get(getSingleBrand)
  .delete(authenticateUser, authorizationPermission, deleteBrand)
  .patch(authenticateUser, authorizationPermission, updateBrand);
module.exports = router;

const express = require("express");
const { getAllStats } = require("../controller/statsController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
const router = express.Router();
router.get("/", authenticateUser, authorizationPermission, getAllStats);
module.exports = router;

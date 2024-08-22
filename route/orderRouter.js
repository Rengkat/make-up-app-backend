const express = require("express");

const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
module.exports = router;

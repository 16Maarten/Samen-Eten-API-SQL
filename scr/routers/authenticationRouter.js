const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");

// UC-103 Systeeminfo opvragen
router.get("/info", authenticationController.getInfo);

module.exports = router;

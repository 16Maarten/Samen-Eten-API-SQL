const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");

// UC-101 Registreren
router.post("/register",authenticationController.validateRegister, authenticationController.register);
// UC-102 Login
router.post("/login",authenticationController.validateLogin, authenticationController.login);
// UC-103 Systeeminfo opvragen
router.get("/info", authenticationController.getInfo);
module.exports = router;

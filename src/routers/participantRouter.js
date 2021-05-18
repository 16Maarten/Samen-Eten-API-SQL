const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");
const studenthomeController = require("../controllers/studenthomeController");
const mealsController = require("../controllers/mealsController");
const authenticationController = require("../controllers/authenticationController");

// UC-401 Aanmelden voor maaltijd
router.post("/studenthome/:homeId/meal/:mealId/signup",authenticationController.validateToken,studenthomeController.studenthomeExist, participantController.signup);
// UC-402 Afmelden voor maaltijd
router.delete("/studenthome/:homeId/meal/:mealId/signoff", authenticationController.validateToken,studenthomeController.studenthomeExist,mealsController.mealExist, participantController.signoff);
// UC-403 Lijst van deelnemers opvragen
router.get("/meal/:mealId/participants", authenticationController.validateToken,mealsController.mealExist, participantController.getParticpants);
// UC-404Details van deelnemer opvragen
router.get("/meal/:mealId/participants/:participantId",authenticationController.validateToken,mealsController.mealExist, participantController.getDetailParticpant);
module.exports = router;
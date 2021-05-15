const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");
const authenticationController = require("../controllers/authenticationController");

// UC-401 Aanmelden voor maaltijd
router.post("/studenthome/:homeId/meal/:mealId/signup",authenticationController.validateToken, participantController.signup);
// UC-402 Afmelden voor maaltijd
router.delete("/studenthome/:homeId/meal/:mealId/signoff", authenticationController.validateToken, participantController.signoff);
// UC-403 Lijst van deelnemers opvragen
router.get("/meal/:mealId/participants", );
// UC-404Details van deelnemer opvragen
router.get("/meal/:mealId/participants/:participantId",authenticationController.validateToken);
module.exports = router;
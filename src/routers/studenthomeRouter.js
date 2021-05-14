const express = require("express");
const router = express.Router();
const studenthomeController = require("../controllers/studenthomeController");
const authenticationController = require("../controllers/authenticationController");

// UC-201 Maak studentenhuis
router.post("",authenticationController.validateToken, studenthomeController.validateStudentHome, studenthomeController.createStudenthome);
// UC-202 Overzicht van studentenhuizen
router.get("", studenthomeController.getStudenthome);
// UC-203 Details van studentenhuis
router.get("/:homeId", studenthomeController.getDetailStudenthome);
// UC-204 Studentenhuis wijzigen
router.put("/:homeId",authenticationController.validateToken,authenticationController.validateUser, studenthomeController.validateStudentHome, studenthomeController.updateStudenthome);
// UC-205 Studentenhuis verwijderen
router.delete("/:homeId",authenticationController.validateToken,authenticationController.validateUser, studenthomeController.deleteStudenthome);
// UC-206 Gebruiker toevoegen aan studentenhuis
router.put("/:homeId/user",authenticationController.validateToken, studenthomeController.createStudenthome);
module.exports = router;
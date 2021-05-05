const express = require("express");
const router = express.Router();
const studenthomeController = require("../controllers/studenthomeController");

// UC-201 Maak studentenhuis
router.post("", studenthomeController.createStudenthome);
// UC-202 Overzicht van studentenhuizen
router.get("", studenthomeController.getStudenthome);
// UC-203 Details van studentenhuis
router.get("/:homeId", studenthomeController.getDetailStudenthome);
// UC-204 Studentenhuis wijzigen
router.put("/:homeId", studenthomeController.updateStudenthome);
// UC-205 Studentenhuis verwijderen
router.delete("/:homeId", studenthomeController.deleteStudenthome);
// UC-206 Gebruiker toevoegen aan studentenhuis
router.put("/:homeId/user", studenthomeController.createStudenthome);
module.exports = router;
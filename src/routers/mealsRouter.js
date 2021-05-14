const express = require("express");
const router = express.Router();
const mealsController = require("../controllers/mealsController");
const authenticationController = require("../controllers/authenticationController");

// UC-301 Maaltijd aanmaken
router.post("/:homeId/meal",authenticationController.validateToken, authenticationController.validateUser, mealsController.validateStudentHomeMeal, mealsController.createStudenthomeMeal);
// UC-302 Maaltijd wijzigen
router.put("/:homeId/meal/:mealId",authenticationController.validateToken, authenticationController.validateUser, mealsController.validateStudentHomeMeal, mealsController.updateStudenthomeMeal);
// UC-303 Lijst van maaltijden opvragen
router.get("/:homeId/meal", mealsController.getStudenthomeMeals);
// UC-304 Details van een maaltijd opvragen
router.get("/:homeId/meal/:mealId", mealsController.getStudenthomeDetailMeal);
// UC-305 Maaltijd verwijderen
router.delete("/:homeId/meal/:mealId",authenticationController.validateToken, authenticationController.validateUser, mealsController.deleteStudenthomeMeal);
module.exports = router;
const express = require("express");
const router = express.Router();
const mealsController = require("../controllers/mealsController");

// UC-301 Maaltijd aanmaken
router.post("/:homeId/meal",mealsController.validateStudentHomeMeal, mealsController.createStudenthomeMeal);
// UC-302 Maaltijd wijzigen
router.put("/:homeId/meal/:mealId",mealsController.validateStudentHomeMeal, mealsController.updateStudenthomeMeal);
// UC-303 Lijst van maaltijden opvragen
router.get("/:homeId/meal", mealsController.getStudenthomeMeals);
// UC-304 Details van een maaltijd opvragen
router.get("/:homeId/meal/:mealId", mealsController.getStudenthomeDetailMeal);
// UC-305 Maaltijd verwijderen
router.delete("/:homeId/meal/:mealId", mealsController.deleteStudenthomeMeal);
module.exports = router;
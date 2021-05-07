const logger = require("tracer").colorConsole();
let db = require("../DAO/database");

let controller = {
  //UC-301 Maaltijd aanmaken
  createStudenthomeMeal(req, res, next) {
    const id = req.params.homeId
    let meal = req.body
    logger.info("Studenthome/:homeId/meal");
    logger.info("Meal body: " + meal);
    logger.info("id: " + id);
    db.addStudenthomeMeal(id,meal, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.debug("meal added to database");
        meal = result
        logger.debug(meal);
        res.status(200).json({ status: "success", meal});
      }
    });
  },

  // UC-302 Maaltijd wijzigen
  updateStudenthomeMeal(req, res, next) {
    logger.info("Studenthome/:homeId/meal/:mealId endpoint called");
    const homeId = req.params.homeId;
    const mealId = req.params.mealId;
    let meal = req.body;
    db.deleteStudenthomeMeal(homeId,mealId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        meal.id = mealId;
        db.addStudenthomeMeal(homeId,meal, (result2, err2) => {
          if (err2) {
            next(err2);
          }
          if (result2) {
            logger.debug(db.db);
            logger.debug("Meal added to database");
            meal = result2;
            res
              .status(200)
              .json({ status: "success", meal, message: "updated" });
          }
        });
      }
    });
  },

  // UC-303 Lijst van maaltijden opvragen
  getStudenthomeMeals(req, res, next) {
    const homeId = req.params.homeId
    logger.info("Studenthome/:homeId/meal endpoint called");
    db.getStudenthomeMeal(homeId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        let meals = [];
        for (let i = 0; i < result.length; i++) {
          meals.push({ mealName: result[i].mealName, id: result[i].id });
          logger.debug(
            "Meal: " + result[i].mealName + " id: " + result[i].id
          );
        }
        res.status(200).json({ status: "success", meals });
      }
    });
  },

  // UC-304 Details van een maaltijd opvragen
  getStudenthomeDetailMeal(req, res, next) {
    const homeId = req.params.homeId;
    const mealId = req.params.mealId;
    logger.info("Studenthome/:homeId/meal/:mealId endpoint called");
    db.getDetailedStudenthomeMeal(homeId,mealId, (meal, err) => {
      if (err) {
        next(err);
      }
      if (meal) {
        logger.info(meal);
        res.status(200).send({ status: "success", meal });
      }
    });
  },

  // UC-305 Maaltijd verwijderen
  deleteStudenthomeMeal(req, res, next) {
    const homeId = req.params.homeId;
    const mealId = req.params.mealId;
    logger.info("Studenthome/:homeId/meal/:mealId endpoint called");
    db.deleteStudenthomeMeal(homeId,mealId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", result });
      }
    });
  },
};

module.exports = controller;

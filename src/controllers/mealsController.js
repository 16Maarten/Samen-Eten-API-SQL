const logger = require("tracer").colorConsole();
const assert = require("assert");
let db = require("../DAO/databaseMeals");

let controller = {

  validateStudentHomeMeal(req, res, next) {
    try {
      const {name,description,offerdOn,price, allergies,ingredients, maxParticipants} = req.body;
      assert(typeof name === "string", "Invalid or missing name")
      assert(typeof description === "string", "Invalid or missing description")
      assert(typeof price === "number", "Invalid or missing price")
      assert(typeof allergies === "string", "Invalid or missing allergies")
      assert(typeof ingredients === "string", "Invalid or missing ingredients")
      assert(typeof maxParticipants === "number", "Invalid or missing maxParticipants")


      const validationDate = /^(19|20)?[0-9]{2}[-](0?[1-9]|[12][0-9]|3[01])[-](0?[1-9]|1[012])[ ]([0-1][0-9]|[2][0-3])[:]([0-5][0-9]|[6][0])[:]([0-5][0-9]|[6][0])$/
      assert(validationDate.test(offerdOn), "offerdOn is invalid")

      const validationPrice = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
      assert(validationPrice.test(price), "price is invalid")

      next()
    } catch (err) {
      logger.error("StudentHomeMeal data is Invalid: ", err.message);
      next({ message: err.message, errCode: 400 })
    }
  },

  //UC-301 Maaltijd aanmaken
  createStudenthomeMeal(req, res, next) {
    const homeId = req.params.homeId
    let meal = req.body
    const userId = req.userId
    logger.info("Studenthome/:homeId/meal");
    logger.info("Meal body: " + meal);
    logger.info("homeId: " + homeId);
    logger.info("userId: " + userId);
    db.addStudenthomeMeal(homeId,userId,meal, (result, err) => {
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
    const mealId = parseInt(req.params.mealId);
    const meal = req.body
    logger.debug(mealId);
    db.updateStudenthomeMeal(mealId,meal, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", meal});
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
        const meals = result;
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
    const mealId = parseInt(req.params.mealId);
    logger.info("Studenthome/:homeId/meal/:mealId endpoint called");
    db.deleteStudenthomeMeal(mealId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", message: "meal deleted" });
      }
    });
  },

  mealExist(req, res, next) {
    const mealId = parseInt(req.params.mealId);
    logger.info("StudenthomeExist called");
    db.checkMeal(mealId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        next()
      }
    });
  },
};

module.exports = controller;

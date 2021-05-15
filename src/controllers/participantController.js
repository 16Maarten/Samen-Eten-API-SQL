const logger = require("tracer").colorConsole();
const assert = require("assert");
let db = require("../DAO/databaseParticipant");

let controller = {

  //UC-401 Aanmelden voor maaltijd
  signup(req, res, next) {
    const homeId = req.params.homeId
    const mealId = req.params.mealId
    const userId = req.userId
    logger.info("/studenthome/:homeId/meal/:mealId/signup");
    logger.info("mealId: " + mealId);
    logger.info("homeId: " + homeId);
    logger.info("userId: " + userId);
    db.addParticipant(homeId,mealId,userId, (result, err) => {
      if (err) {
          err.message = "gaat het hier fout???"
        next(err);
      }
      if (result) {
        logger.info("particpant: "+userId+" is signedup for meal: "+ mealId);
        res.status(200).json({ status: "success", message: "particpant: "+userId+" is signedup for meal: "+ mealId});
      }
    });
  },

  //UC-402 Afmelden voor maaltijd
  signoff(req, res, next) {
    const homeId = parseInt(req.params.homeId)
    const mealId = parseInt(req.params.mealId)
    const userId = parseInt(req.userId)
    logger.info("/studenthome/:homeId/meal/:mealId/signoff");
    logger.info("mealId: " + mealId);
    logger.info("homeId: " + homeId);
    logger.info("userId: " + userId);
    db.deleteParticipant(homeId,mealId,userId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info("particpant: "+userId+" is signedoff for meal: "+ mealId);
        res.status(200).json({ status: "success", message: "particpant: "+userId+" is signedoff for meal: "+ mealId});
      }
    });
  },

  //UC-403 Lijst van deelnemers opvragen
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

  //UC-404 Details van deelnemer opvragen
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
}

module.exports = controller;

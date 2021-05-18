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
  getParticpants(req, res, next) {
    const mealId = req.params.mealId
    logger.info("/meal/:mealId/participants endpoint called");
    db.getParticipantsMeal(mealId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        const participants = result;
        logger.info(participants)
        res.status(200).json({ status: "success", participants });
      }
    });
  },

  //UC-404 Details van deelnemer opvragen
  getDetailParticpant(req, res, next) {
    const participantId = req.params.participantId
    const mealId = req.params.mealId
    logger.info("/meal/:mealId/participants/:participantId endpoint called");
    db.getDetailParticipantsMeal(mealId,participantId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        const participant = result;
        logger.info(participant)
        res.status(200).json({ status: "success", participant});
      }
    });
  },
}

module.exports = controller;

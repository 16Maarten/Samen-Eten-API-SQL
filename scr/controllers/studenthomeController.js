const logger = require("tracer").colorConsole();
let db = require("../DAO/database");

let controller = {
  // UC-201 Maak studentenhuis
  createStudenthome(req, res, next) {
    logger.info("Studenthome endpoint called");
    const studenthome = req.body;
    logger.info("Studenthome body: " + studenthome);
    db.addStudenthome(studenthome, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.debug(db.db);
        logger.debug("StudentHome added to database");
        res.status(200).json({ status: "success", Studenthome: result.name, id: result.id });
      }
    });
  },

  // UC-202 Overzicht van studentenhuizen
  getStudenthome(req, res, next) {
    const name = req.query.name;
    const city = req.query.city;
    logger.info("Name: " + name + " City: " + city);
    logger.info("Studenthome endpoint called");
    db.getStudenthome(name, city, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        let studenthomes = [];
        for (let i = 0; i < result.length; i++) {
          studenthomes.push({ Studenthome: result[i].name, id: result[i].id });
          logger.debug(
            "Studenthome: " + result[i].name + " id: " + result[i].id
          );
        }
        res.status(200).json({ status: "success", studenthomes });
      }
    });
  },

  // UC-203 Details van studentenhuis
  getDetailStudenthome(req, res, next) {
    const id = req.params.homeId
    logger.debug(id)
    logger.info("Studenthome/:homeId endpoint called");
    db.getDetailedStudenthome(id, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({status: "success",result});
      }
    });
  },

  // UC-204 Studentenhuis wijzigen
  updateStudenthome(req, res, next) {
    logger.info("Studenthome/:homeId endpoint called");
    const id = req.params.homeId;
    let studenthome = req.body;
    logger.debug(id);
    db.deleteStudenthome(id, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        studenthome.id = id
        db.addStudenthome(studenthome, (result2, err2) => {
          if (err2) {
            next(err2);
          }
          if (result2) {
            logger.debug(db.db);
            logger.debug("StudentHome added to database");
            studenthome = result2
            res.status(200).json({ status: "success", studenthome, message: "updated"});
          }
        });
      }
    });
  },

  // UC-205 Studentenhuis verwijderen
  deleteStudenthome(req, res, next) {
    const id = req.params.homeId;
    logger.debug(id);
    logger.info("Studenthome/:homeId endpoint called");
    db.deleteStudenthome(id, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({status: "success",result});
      }
    });
  },

  // UC-206 Gebruiker toevoegen aan studentenhuis
  addUserStudenthome(req, res, next) {
    logger.info("Studenthome/:homeId/user endpoint called");
    res.status(200).send(result);
  },
};

module.exports = controller;

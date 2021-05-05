const logger = require("tracer").colorConsole();
let db = require("../DAO/database");

let controller = {
  // UC-201 Maak studentenhuis
  createStudenthome(req, res) {
    logger.info("Studenthome endpoint called");
    const studenthome = req.body;
    logger.info("Studenthome body: " + studenthome);
    db.add(studenthome, (result, err) => {
      if (err) {
        res.status(400).json(err);
      }
      if (result) {
        logger.debug(db.db);
        logger.debug("StudentHome added to database");
        res.json(studenthome.name + " has been added to the database with id:");
      }
    });
  },

  // UC-202 Overzicht van studentenhuizen
  getStudenthome(req, res) {
    logger.info("Studenthome endpoint called");
    res.status(200).send(result);
  },

  // UC-203 Details van studentenhuis
  getDetailStudenthome(req, res) {
    logger.info("Studenthome/:homeId endpoint called");
    res.status(200).send(result);
  },

  // UC-204 Studentenhuis wijzigen
  updateStudenthome(req, res) {
    logger.info("Studenthome/:homeId endpoint called");
    res.status(200).send(result);
  },

  // UC-205 Studentenhuis verwijderen
  deleteStudenthome(req, res) {
    logger.info("Studenthome/:homeId endpoint called");
    res.status(200).send(result);
  },

  // UC-206 Gebruiker toevoegen aan studentenhuis
  addUserStudenthome(req, res) {
    logger.info("Studenthome/:homeId/user endpoint called");
    res.status(200).send(result);
  },
};

module.exports = controller;

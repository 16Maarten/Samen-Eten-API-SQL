const logger = require("tracer").colorConsole();
let db = require("../DAO/database");

let controller = {
  // UC-201 Maak studentenhuis
  createStudenthome(req, res, next) {
    logger.info("Studenthome endpoint called");
    const studenthome = req.body;
    logger.info("Studenthome body: " + studenthome);
    db.add(studenthome, (result, err) => {
      if (err) {
        next(err)
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
    db.get(name,city, (result, err) => {
      if (err) {
        next(err)
      }
      if (result) {
        let studenthomes = []
        for(let i = 0; i < result.length; i++) {
          studenthomes.push({Studenthome: result[i].name, id: result[i].id})
          logger.debug("Studenthome: "+ result[i].name +" id: " + result[i].id);
        }
        res.status(200).json({ status: "success", studenthomes });
      }
    });
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

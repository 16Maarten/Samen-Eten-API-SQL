const logger = require("tracer").colorConsole();
const assert = require("assert");
let db = require("../DAO/database");

let controller = {
  validateStudentHome(req, res, next) {
    try {
      const {
        name,
        streetName,
        houseNumber,
        postalCode,
        city,
        phoneNumber,
      } = req.body;
      assert(typeof name === "string", "Invalid or missing name");
      assert(typeof streetName === "string", "Invalid or missing streetName");
      assert(typeof houseNumber === "number", "Invalid or missing houseNumber");
      assert(typeof postalCode === "string", "Invalid or missing postalCode");
      assert(typeof city === "string", "Invalid or missing city");
      assert(typeof phoneNumber === "string", "Invalid or missing phoneNumber");

      const validatePostalCode = /^(?:NL-)?(\d{4})\s*([A-Z]{2})$/i;
      assert(validatePostalCode.test(postalCode), "Invalid postalCode");

      const validationPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      assert(validationPhoneNumber.test(phoneNumber), "Invalid phoneNumber");

      if (!req.params.homeId) {
        let studenthome = { city, streetName, houseNumber };

        db.db.forEach((e) => {
          let studenthome2 = {
            city: e.city,
            streetName: e.streetName,
            houseNumber: e.houseNumber,
          };
          logger.debug(studenthome);
          logger.debug(studenthome2);
          assert.notDeepStrictEqual(
            studenthome,
            studenthome2,
            "Studenthome already exists"
          );
        });
      }
      next();
    } catch (err) {
      next({ message: err.message, errCode: 400 });
    }
  },
  // UC-201 Maak studentenhuis
  createStudenthome(req, res, next) {
    logger.info("Studenthome endpoint called");
    let studenthome = req.body;
    logger.info("Studenthome body: " + studenthome);
    db.addStudenthome(studenthome, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.debug(db.db);
        logger.debug("StudentHome added to database");
        studenthome = result;
        res.status(200).json({ status: "success", studenthome });
      }
    });
  },

  // UC-202 Overzicht van studentenhuizen
  getStudenthome(req, res, next) {
    const name = req.query.name;
    const city = req.query.city;
    let studenthomes = [];
    if (!name && !city) {
      res.status(200).json({ status: "success", studenthomes });
    } else {
      logger.info("Name: " + name + " City: " + city);
      logger.info("Studenthome endpoint called");
      db.getStudenthome(name, city, (result, err) => {
        if (err) {
          next(err);
        }
        if (result) {
          for (let i = 0; i < result.length; i++) {
            studenthomes.push({
              name: result[i].name,
              streetName: result[i].streetName,
              houseNumber: result[i].houseNumber,
              postalCode: result[i].postalCode,
              city: result[i].city,
              phoneNumber: result[i].phoneNumber,
              id: result[i].id,
            });
            logger.debug(
              "Studenthome: " + result[i].name + " id: " + result[i].id
            );
          }
          res.status(200).json({ status: "success", studenthomes });
        }
      });
    }
  },

  // UC-203 Details van studentenhuis
  getDetailStudenthome(req, res, next) {
    const id = req.params.homeId;
    logger.debug(id);
    logger.info("Studenthome/:homeId endpoint called");
    db.getDetailedStudenthome(id, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", result });
      }
    });
  },

  // UC-204 Studentenhuis wijzigen
  updateStudenthome(req, res, next) {
    logger.info("Studenthome/:homeId endpoint called");
    let homeId = parseInt(req.params.homeId);
    let studenthome = req.body;
    logger.debug(homeId);
    db.getDetailedStudenthome(homeId, (result, err) => {
      if (err) {
        err.errCode = 400
        next(err);
      }
      if (result) {
        db.deleteStudenthome(homeId, (result2, err2) => {
          if (err2) {
            next(err2);
          }
          if (result2) {
            studenthome.id = homeId
            studenthome.meals = result.meals
            db.addStudenthome(studenthome,(result3, err3) => {
                if (err3) {
                  next(err3);
                }
                if (result3) {
                  logger.debug(db.db);
                  logger.debug("StudentHome added to database");
                  studenthome = result3;
                  res.status(200).json({status: "success",studenthome,
                  });
                }
              });
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
        let studenthome = result
        logger.info(result);
        res.status(200).send({ status: "success", studenthome });
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

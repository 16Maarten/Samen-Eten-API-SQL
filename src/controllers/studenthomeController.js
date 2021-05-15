const logger = require("tracer").colorConsole();
const assert = require("assert");
let db = require("../DAO/databaseStudenthome");

let controller = {
  validateStudentHome(req, res, next) {
    try {
      const {
        name,
        address,
        houseNumber,
        postalCode,
        city,
        telephone,
      } = req.body;
      assert(typeof name === "string", "Invalid or missing name");
      assert(typeof address === "string", "Invalid or missing address");
      assert(typeof houseNumber === "number", "Invalid or missing houseNumber");
      assert(typeof postalCode === "string", "Invalid or missing postalCode");
      assert(typeof city === "string", "Invalid or missing city");
      assert(typeof telephone === "string", "Invalid or missing telephone");

      const validatePostalCode = /^(?:NL-)?(\d{4})\s*([A-Z]{2})$/i;
      assert(validatePostalCode.test(postalCode), "Invalid postalCode");

      const validationtelephone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      assert(validationtelephone.test(telephone), "Invalid telephone");

      next();
    } catch (err) {
      next({ message: err.message, errCode: 400 });
    }
  },

  validateStudentHomeUser(req, res, next) {
    try {
      const { id } = req.body;
      assert(typeof id === "number", "Invalid or missing id");

      next();
    } catch (err) {
      next({ message: err.message, errCode: 400 });
    }
  },

  // UC-201 Maak studentenhuis
  createStudenthome(req, res, next) {
    logger.info("Studenthome endpoint called");
    let studenthome = req.body;
    studenthome.userId = req.userId
    logger.debug("Studenthome body: " + studenthome);
    db.addStudenthome(studenthome, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
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
          studenthomes = result
          res.status(200).json({ status: "success", studenthomes });
        }
      });
    }
  },

  // UC-203 Details van studentenhuis
  getDetailStudenthome(req, res, next) {
    const homeId = parseInt(req.params.homeId);
    logger.debug(homeId);
    logger.info("Studenthome/:homeId endpoint called");
    db.getDetailedStudenthome(homeId, (result, err) => {
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
    const homeId = parseInt(req.params.homeId);
    const studenthome = req.body
    logger.debug(homeId);
    logger.info("Studenthome/:homeId endpoint called");
    db.updateStudenthome(homeId,studenthome, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", studenthome});
      }
    });
  },

  // UC-205 Studentenhuis verwijderen
  deleteStudenthome(req, res, next) {
    const homeId = parseInt(req.params.homeId);
    logger.debug(homeId);
    logger.info("Studenthome/:homeId endpoint called");
    db.deleteStudenthome(homeId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", message: "Studenthome deleted" });
      }
    });
  },

  // UC-206 Gebruiker toevoegen aan studentenhuis
  addStudenthomeUser(req, res, next) {
    logger.info("Studenthome/:homeId/user endpoint called");
    const homeId = parseInt(req.params.homeId);
    const userId = parseInt(req.body.id)
    logger.debug(homeId);
    db.addUser(homeId,userId, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info(result);
        res.status(200).send({ status: "success", message: "Administrator added with id " + userId });
      }
    });
  }
};

module.exports = controller;

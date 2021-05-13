const logger = require('tracer').colorConsole();
const jwt = require('jsonwebtoken')
const assert = require("assert");
let db = require("../DAO/databaseAuthenticatie");

let info = {
  Student: "Maarten de Zwart",
  Studentnummer: 2176137,
  Description: "Ik ben een student op Avans",
};

let controller = {
  validateRegister(req, res, next) {
    try {
      const {firstname,lastname,email,password,student_Number} = req.body;
      assert(typeof firstname === 'string','Invalid or missing firstname')
      assert( typeof lastname === 'string','Invalid or missing lastname')
      assert(typeof student_Number === 'number', 'Invalid or missing student_Number')
      assert(typeof email === 'string', 'Invalid or missing email')
      assert(typeof password === 'string','Invalid or missing password')

      const validateEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      assert(validateEmail.test(email), "Invalid email");
      next()
    } catch (ex) {
      console.log('validateRegister error: ', ex)
      res
        .status(402)
        .json({ message: ex.toString(), datetime: new Date().toISOString() })
    }
  },

  validateLogin(req, res, next) {
    try {
      const {email,password} = req.body;
      assert(typeof email === 'string', 'Invalid or missing email')
      assert(typeof password === 'string','Invalid or missing password')

      const validateEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      assert(validateEmail.test(email), "Invalid email");
      next()
    } catch (ex) {
      console.log('validateRegister error: ', ex)
      res
        .status(402)
        .json({ message: ex.toString(), datetime: new Date().toISOString() })
    }
  },

  // UC-101 Register
  register(req, res, next){
      logger.info("register endpoint called");
      let user = req.body;
      logger.info("user body: " + user);
      db.addUser(user, (result, err) => {
        if (err) {
          next(err);
        }
        if (result) {
          logger.info("User added to database");
          user = result;
          res.status(200).json({ status: "success", user });
        }
      });
    },

  // UC-102 login
  login(req, res, next){
    logger.info("login endpoint called");
    let user = req.body;
    logger.info("user body: " + user);
    db.checkUser(user, (result, err) => {
      if (err) {
        next(err);
      }
      if (result) {
        logger.info("User login succes");
        user = result;
        res.status(200).json({ status: "success", user });
      }
    });
  },
  // UC-103 Systeeminfo opvragen
    getInfo(req, res) {
      logger.info("Info endpoint called"); 
      res.status(200).send(info);
    },
  };
  
module.exports = controller;

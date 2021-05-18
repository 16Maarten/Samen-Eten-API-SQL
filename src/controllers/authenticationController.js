const logger = require('tracer').colorConsole();
const jwt = require('jsonwebtoken')
const jwtSecretKey = require("../DAO/databaseConfig").jwtSecretKey;
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
      assert(typeof lastname === 'string','Invalid or missing lastname')
      assert(typeof student_Number === 'number', 'Invalid or missing student_Number')
      assert(typeof email === 'string', 'Invalid or missing email')
      assert(typeof password === 'string','Invalid or missing password')

      const validateEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      assert(validateEmail.test(email), "Invalid email");
      next()
    } catch (err) {
      console.log('validateRegister error: ', err)
      next({ message: err.message, errCode: 400 })
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
    } catch (err) {
      console.log('validateRegister error: ', err)
      next({ message: err.message, errCode: 400 })
    }
  },

  validateToken(req, res, next) {
    logger.info('validateToken called')
    const authHeader = req.headers.authorization
    if (!authHeader) {
      logger.warn('Authorization header missing!')
      res.status(401).json({
        error: 'Authorization header missing!',
        datetime: new Date().toISOString()
      })
    } else {
      // Strip the word 'Bearer ' from the headervalue
      const token = authHeader.substring(7, authHeader.length)
      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn('Not authorized')
          res.status(401).json({
            error: 'Not authorized',
            datetime: new Date().toISOString()
          })
        }
        if (payload) {
          logger.debug('token is valid', payload)
          req.userId = payload.id
          logger.debug("id: "+ req.userId)
          next()
        }
      })
    }
  },

  validateUser(req, res, next) {
    const userId = parseInt(req.userId)
    const homeId = parseInt(req.params.homeId);
    logger.info('validateUser called')
    db.validateUser(homeId, userId, (result, err) => {
      if (err) {
        logger.warn('Not authorized')
        res.status(401).json({
          error: 'Not authorized',
          datetime: new Date().toISOString()
        })
      }
      if (result) {
        logger.info("User is valid");
        next()
      }
    });
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

const logger = require("tracer").colorConsole();
const pool = require("./databasePool");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../DAO/databaseConfig").jwtSecretKey;
const config = require("./databaseConfig");

let database = {
  addUser(item, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error("Error getting connection from pool: " + err.toString());
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "INSERT INTO `user` (`First_Name`, `Last_Name`, `Email`, `Student_Number`, `Password`) VALUES (?, ?, ?, ?, ?)",
          [
            item.firstname,
            item.lastname,
            item.email,
            item.student_Number,
            item.password,
          ],
          (err2, rows) => {
            connection.release();
            if (err2) {
              err2.message = "This email has already been taken.";
              err2.errCode = 400;
              callback(undefined, err2);
            } else {
              logger.trace(rows);
              const payload = {
                id: rows.insertId,
              };
              // Userinfo returned to the caller.
              const userinfo = {
                emailAdress: item.email,
                token: jwt.sign(payload, jwtSecretKey, { expiresIn: "1d" }),
              };
              logger.debug("Registered", userinfo);
              callback(userinfo, undefined);
            }
          }
        );
      }
    });
  },

  validateUser(homeId, userId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT *"+
          "FROM `home_administrators`"+
          "RIGHT JOIN `studenthome` ON `home_administrators`.`StudenthomeID` = `studenthome`.`ID`"+
          "WHERE `home_administrators`.`UserID` = ? AND `home_administrators`.`StudenthomeID` = ?  OR `studenthome`.`UserID` = ? AND `studenthome`.`ID` = ?",
          [
            userId,
            homeId,
            userId,
            homeId
          ],
          (err2, rows) => {
            connection.release();
            if (err2) {
              err2.message = "HomeId doesn't exists";
              err2.errCode = 400;
              callback(undefined, err2);
            } else {
                if(rows.length === 1){
                  logger.debug("user is validated")
                  callback(rows, undefined);
                } else {
                  callback(undefined, {message: "Not authorized"});
                }
              }
          });
      }
    });
  },

  checkUser(item, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        logger.error("Error getting connection from pool: " + err.toString());
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT `ID`, `Email`, `Password`, `First_Name`, `Last_Name` FROM `user` WHERE `Email` = ?",
          [item.email],
          (err2, rows) => {
            connection.release();
            if (err2) {
              err2.message = "This user doesn't exist";
              err2.errCode = 400;
              callback(undefined, err2);
            } else {
              logger.trace(rows);
              if (
                rows &&
                rows.length === 1 &&
                rows[0].Password == item.password
              ) {
                logger.info("passwords DID match, sending valid token");
                const payload = {
                  id: rows[0].ID,
                };
                const userinfo = {
                  emailAdress: item.email,
                  token: jwt.sign(payload, jwtSecretKey, { expiresIn: "1d" }),
                };
                logger.debug("login", userinfo);
                callback(userinfo, undefined);
              } else {
                const err3 = {
                message:"User not found or password invalid",
                errCode: 400
                }
                logger.info("User not found or password invalid");
                callback(undefined, err3);
              }
            }
          }
        );
      }
    });
  },
};

module.exports = database;

const logger = require("tracer").colorConsole();
const pool = require("./databasePool");
const config = require("./databaseConfig");

let database = {
  getStudenthome(name, city, callback) {
    let queryPart = "";
    let error;
    if (name && city) {
      queryPart = "WHERE `Name` = '" + name + "' AND `City` = '" + city + "'";
      error =
        "No studentHome was found on name: " + name + " and city: " + city;
    } else if (name) {
      queryPart = "WHERE `Name` = '" + name + "'";
      error = "No studentHome was found on name: " + name;
    } else if (city) {
      queryPart = "WHERE `City` = '" + city + "'";
      error = "No studentHome was found on city: " + city;
    }

    let sqlQuery = "SELECT * FROM `studenthome` " + queryPart;

    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query( sqlQuery,(err2, results) => {
            connection.release();
            if (err2) {
              err2 = {
                message: error,
                errCode: 404,
              }
              callback(undefined, err2);
            }
            if (results) {
              if (!results.length && error) {
                err2 = {
                  message: error,
                  errCode: 404,
                }
                callback(undefined, err2);
              } else {
                callback(results, undefined);
              }
          }  
      })
      }
    });
  },

  getDetailedStudenthome(homeId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT *" +
            "FROM `studenthome`" +
            "where `ID` = ?",
          [homeId],
          (err2, result) => {
            connection.release();
            if (err2) {
              logger.info("query failed")
              err2.message = "query failed";
              err2.errCode = 500;
              callback(undefined, err2);
            }
            if (result.length) {
              logger.trace("results: ", result);
              callback(...result, undefined);
            }
            else{
              const err3 = {
                message: "studenthomeId doesn't exist",
                errCode: 404
              }
              callback(undefined, err3);
            }
          }
        );
      }
    });
  },

  deleteStudenthome(homeId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
            "DELETE FROM `studenthome`" +
            "where `ID` = ?",
          [homeId],
          (err2, results) => {
            connection.release();
            if (err2) {
              logger.info("homeId doesn't exist")
              err2.message = "homeId doesn't exist";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              callback(results, undefined);
            }
          }
        );
      }
    });
  },

  updateStudenthome(homeId,studenthome, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
            "UPDATE `studenthome`" +
            "SET `Name` = ?, `Address` = ?, `House_Nr` = ?, `Postal_Code` = ?,`Telephone` = ?,`City` = ?" +
            "where `ID` = ?",
          [studenthome.name,studenthome.address, studenthome.houseNumber, studenthome.postalCode, studenthome.telephone, studenthome.city, homeId],
          (error, results) => {
            connection.release();
            if (error) {
              logger.info("homeId doesn't exist!")
              error.message = "homeId doesn't exist!";
              error.errCode = 400;
              callback(undefined, error);
            }
            if (results) {
              callback(results, undefined);
            }
          }
        );
      }
    });
  },

  addStudenthome(item, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        logger.debug([
          item.name,
          item.address,
          item.houseNumber,
          item.userId,
          item.postalCode,
          item.telephone,
          item.city,
        ]);
        connection.query(
          "INSERT INTO `studenthome` (`Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`,`Telephone`,`City`) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            item.name,
            item.address,
            item.houseNumber,
            item.userId,
            item.postalCode,
            item.telephone,
            item.city,
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              err2.message = "Studenthome already exists";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              item.id = results.insertId;
              callback(item, undefined);
            }
          }
        );
      }
    });
  },

  addUser(homeId, userId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "INSERT INTO `home_administrators` VALUES (?, ?)",
          [
            userId,
            homeId
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              logger.info("User doesn't exist")
              err2.message = "User doesn't exist";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              callback(results, undefined);
            }
          }
        );
      }
    });
  },

  checkStudenthome(homeId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT * FROM `studenthome` WHERE `ID` = ?",
          [
            homeId
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              logger.info("query failed")
              err2.message = "query failed";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results.length) {
              callback(results, undefined);
            } else {
              logger.info("studenthomeId doesn't exist")
              const err3 = {
              message: "studenthomeId doesn't exist",
              errCode: 400
              }
              callback(undefined, err3);
            }
          }
        );
      }
    });
  },

};

module.exports = database;

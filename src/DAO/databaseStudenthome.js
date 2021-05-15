const logger = require("tracer").colorConsole();
const pool = require("./databasePool");
const config = require("./databaseConfig");

let database = {
  getStudenthome(name, city, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 400;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT `Name`,`Address`,`House_Nr`,`Postal_Code`,`City`,`Telephone`FROM `studenthome`WHERE `Name` = ? OR `City`  = ?",
          [name, city],
          (err2, results) => {
            connection.release();
            if (err2) {
              err2.message = "getStudenthome failed";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              logger.trace("results: ", results);
              const mappedResults = results.map((item) => {
                return {
                  ...item,
                };
              });
              if (mappedResults.length > 0) {
                callback(mappedResults, undefined);
              } else {
                let err3 = {
                  message: "Studenthome doesn't exist with name: " + name+ " or in the city: " + city,
                  errCode: 404,
                };
                callback(undefined, err3);
              }
            }
          }
        );
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
          (err2, results) => {
            connection.release();
            if (err2) {
              logger.info("homeId doesn't exist failed")
              err2.message = "homeId doesn't exist failed";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              logger.trace("results: ", results);
              const mappedResults = results.map((item) => {
                return {
                  ...item,
                };
              });
              callback(mappedResults, undefined);
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
};

module.exports = database;

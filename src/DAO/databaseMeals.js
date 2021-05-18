const logger = require("tracer").colorConsole();
const pool = require("./databasePool");
const config = require("./databaseConfig");

let database = {
  addStudenthomeMeal(homeId,userId, meal, callback) {
    meal.creationDate = new Date();
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        logger.debug([
          meal.name,
          meal.description,
          meal.ingredients,
          meal.allergies,
          meal.creationDate,
          meal.offerdOn,
          meal.price,
          meal.maxParticipants,
        ]);
        connection.query(
          "INSERT INTO `meal` (`Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`,`OfferedOn`,`Price`,`UserID`,`StudenthomeID`,`MaxParticipants`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            meal.name,
            meal.description,
            meal.ingredients,
            meal.allergies,
            meal.creationDate,
            meal.offerdOn,
            meal.price,
            userId,
            homeId,
            meal.maxParticipants,
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              err2.message = "An input was wrong";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              meal.id = results.insertId;
              callback(meal, undefined);
            }
          }
        );
      }
    });
  },

  getStudenthomeMeal(homeId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 400;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT `Name`, `Description`, `Ingredients`, `Allergies`, `OfferedOn`,`Price`,`MaxParticipants`, `ID`FROM `meal` WHERE `StudenthomeID` = ?",
          [homeId],
          (err2, results) => {
            connection.release();
            if (err2) {
              err2.message = "getStudenthomeMeal failed";
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
                  message: "Studenthome doesn't have any meals",
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

  getDetailedStudenthomeMeal(homeId, mealId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 400;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT `Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`,`OfferedOn`,`Price`,`UserID`,`MaxParticipants`, `ID`FROM `meal` WHERE `StudenthomeID` = ? AND `ID` = ?",
          [homeId,mealId],
          (err2, rows) => {
            connection.release();
            if (err2) {
              logger.error(err2)
              callback(undefined, err2);
            }
            if (rows) {
              logger.trace(rows)
              if(rows.length > 0){
                callback(...rows, undefined);
              } else {
                logger.info("mealId doesn't exist in this studenthome")
                const err3 = {
                message: "mealId doesn't exist in this studenthome",
                errCode: 404
                }
                callback(undefined, err3);
              }
            }
          }
        );
      }
    });
  },

  deleteStudenthomeMeal(mealId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
            "DELETE FROM `meal`" +
            "where `ID` = ?",
          [mealId],
          (err2, rows) => {
            connection.release();
            if (err2) {
              callback(undefined, err2);
            }
            if (rows) {
              logger.trace(rows)
              if(rows.affectedRows > 0){
                callback(rows, undefined);
              } else {
                logger.info("mealId doesn't exist in this studenthome")
                const err3 = {
                message: "mealId doesn't exist in this studenthome",
                errCode: 404
                }
                callback(undefined, err3);
              }
            }
          }
        );
      }
    });
  },

  updateStudenthomeMeal(mealId,meal, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
            "UPDATE `meal`" +
            "SET `Name` = ?, `Description` = ?, `Ingredients` = ?, `Allergies` = ?,`OfferedOn` = ?,`Price` = ? ,`MaxParticipants` = ? "+
            "where `ID` = ?",
          [meal.name,meal.description, meal.ingredients, meal.allergies, meal.offerdOn, meal.price,meal.maxParticipants, mealId],
          (err2, rows) => {
            connection.release();
            if (err2) {
              logger.error(err2)
              callback(undefined, err2);
            }
            if (rows) {
              logger.trace(rows)
              if(rows.changedRows > 0){
                callback(rows, undefined);
              } else {
                logger.info("mealId doesn't exist in this studenthome!")
                const err3 = {
                message: "mealId doesn't exist in this studenthome",
                errCode: 404
                }
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

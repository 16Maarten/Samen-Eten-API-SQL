const logger = require("tracer").colorConsole();
const pool = require("./databasePool");
const config = require("./databaseConfig");

let database = {
  addParticipant(homeId,mealId,userId,callback) {
    const creationDate = new Date();
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "INSERT INTO `participants` VALUES (?, ?, ?, ?)",
          [
            userId,
            homeId,
            mealId,
            creationDate
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              err2.message = "mealId or homeId doesn't exist";
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

  deleteParticipant(homeId,mealId,userId, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
          err.message = "Database connection failed";
          err.errCode = 500;
          callback(undefined, err);
        }
        if (connection) {
          connection.query(
            "DELETE FROM `participants` WHERE `UserId` = ? AND `StudenthomeID` = ? AND `MealID` = ?",
            [
              userId,
              homeId,
              mealId
            ],
            (err2, results) => {
              connection.release();
              if (err2) {
                err2.message = "mealId or homeId doesn't exist wtf";
                err2.errCode = 400;
                callback(undefined, err2);
              }
              if (results) {
                callback(results, undefined);
              }
            }
          )}
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
                errCode: 400
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

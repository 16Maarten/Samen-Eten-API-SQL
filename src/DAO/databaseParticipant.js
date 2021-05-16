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
                err2.message = "mealId or homeId doesn't exist!";
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

 getParticipantsMeal(mealId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT `UserID`,`SignedUpOn` FROM `participants` WHERE `MealID` = ?",
          [
            mealId
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              err2.message = "mealId doesn't exist";
              err2.errCode = 400;
              callback(undefined, err2);
            }
            if (results) {
              const mappedResults = results.map((item) => {
                return {
                  ...item,
                };
              })
              callback(mappedResults, undefined);
            }
          }
        )}
    });
  },

  getDetailParticipantsMeal(mealId,participantId, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 500;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(
          "SELECT `ID`,`First_Name`,`Last_Name`,`Email`,`Student_Number` FROM `user` WHERE `ID` = ?",
          [
            participantId
          ],
          (err2, results) => {
            connection.release();
            if (err2) {
              logger.trace(err2)
              err2.message = "Database error";
              err2.errCode = 500;
              callback(undefined, err2);
            }
            if (results) {
              if(results.length > 0){
              callback(results, undefined);
              } else {
                const err3 = {
                  message: "participantId doesn't exist",
                  errCode: 400
                  }
                callback(undefined, err3);
              }
            }
          }
        )}
    });
  },
};

module.exports = database;

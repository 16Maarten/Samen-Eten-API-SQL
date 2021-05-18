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
              err2.message = "mealId doesn't exist";
              err2.errCode = 404;
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
              logger.trace(results)
              if (err2) {
                err2.message = "user is not singned up";
                err2.errCode = 400;
                callback(undefined, err2);
              }
              if (results) {
                if(results.affectedRows > 0){
                callback(results, undefined);
                } else {
                  logger.info("user is not singned up")
                  const err3 = {
                  message: "user is not singned up",
                  errCode: 404
                  }
                  callback(undefined, err3);
                }
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
              err2.errCode = 404;
              callback(undefined, err2);
            }
            if (results) {
              logger.trace(results)
              if(results.length > 0){
              const mappedResults = results.map((item) => {
                return {
                  ...item,
                };
              })
              callback(mappedResults, undefined);
            } else {
              logger.info("mealId doesn't exist")
              const err3 = {
              message: "mealId doesn't exist",
              errCode: 404
              }
              callback(undefined, err3);
            }
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
              callback(...results, undefined);
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

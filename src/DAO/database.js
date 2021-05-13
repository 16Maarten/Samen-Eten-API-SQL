const logger = require("tracer").colorConsole();
let lastInsertedIndex = 2;
let lastInsertedMealIndex = 1;
const pool = require("./databasePool");
const config = require("./databaseConfig");

let database = {
  getStudenthome(name, city, callback) {
    let sqlQuery =
      "SELECT " +
      "`Name`," +
      "`Address`," +
      "`House_Nr`," +
      "`Postal_Code`," +
      "`City`," +
      "`Telephone`" +
      "FROM `studenthome` " +
      "WHERE `Name` LIKE '" +name +"'"+
      "OR `City` LIKE '" +city +"'";
    pool.getConnection((err, connection) => {
      logger.debug('sqlQuery =', sqlQuery)
      if (err) {
        err.message = "Database connection failed";
        err.errCode = 400;
        callback(undefined, err);
      }
      if (connection) {
        connection.query(sqlQuery, (err2, results) => {
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
                ...item
              }
            })

            if (mappedResults.length > 0) {
              callback(mappedResults, undefined);
            } else {
              let err3 = {
                message: "Studenthome doesn't exist",
                errCode: 404,
              };
              if (name) {
                err3.message += " name: " + name;
              }
              if (city) {
                err3.message += " city: " + city;
              }
              callback(undefined, err);
            }
          }
        });
      }
    });
  },

  getDetailedStudenthome(id, callback) {
    let detailedStudenthome = this.db.filter((e) => {
      return e.id == id;
    });
    if (detailedStudenthome.length > 0) {
      callback(detailedStudenthome[0], undefined);
    } else {
      let err = {
        message: "Studenthome id doesn't exist",
        errCode: 404,
      };
      if (id) {
        err.message += " id: " + id;
      }
      callback(undefined, err);
    }
  },

  deleteStudenthome(id, callback) {
    let deleteStudenthome = this.db.filter((e) => {
      return e.id == id;
    });
    const index = this.db.indexOf(deleteStudenthome[0]);
    if (deleteStudenthome.length > 0) {
      this.db.splice(index, 1);
      callback(deleteStudenthome[0], undefined);
    } else {
      let err = {
        message: "Studenthome id doesn't exist",
        errCode: 404,
      };
      if (id) {
        err.message += " id: " + id;
      }
      callback(undefined, err);
    }
  },

  addStudenthome(item, callback) {
    logger.debug("item id:" + item.id);
    if (typeof item.id == "undefined") {
      item.id = lastInsertedIndex++;
      item.meals = [];
    }
    this.db.push(item);
    callback(item, undefined);
  },

  addStudenthomeMeal(homeId, item, callback) {
    let studenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    logger.debug("studenthome: " + studenthome[0]);
    let studenthomeIndex = this.db.indexOf(studenthome[0]);
    if (!item.id) {
      item.creationDate = new Date();
      item.id = lastInsertedMealIndex++;
    }
    this.db[studenthomeIndex].meals.push(item);
    callback(item, undefined);
  },

  getStudenthomeMeal(homeId, callback) {
    let Studenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    logger.debug("studentHome: " + Studenthome[0]);
    const meals = Studenthome[0].meals;
    logger.debug(meals);
    callback(meals, undefined);
  },

  getDetailedStudenthomeMeal(homeId, mealId, callback) {
    let detailedStudenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    if (detailedStudenthome.length > 0) {
      let detailedmeals = this.db[
        this.db.indexOf(detailedStudenthome[0])
      ].meals.filter((e) => {
        return e.id == mealId;
      });
      if (detailedmeals.length > 0) {
        callback(detailedmeals[0], undefined);
      } else {
        let err = {
          message: "meal id doesn't exist",
          errCode: 404,
        };
        if (homeId) {
          err.message += " id: " + mealId;
        }
        callback(undefined, err);
      }
    } else {
      let err = {
        message: "Studenthome id doesn't exist",
        errCode: 404,
      };
      if (homeId) {
        err.message += " id: " + homeId;
      }
      callback(undefined, err);
    }
  },

  deleteStudenthomeMeal(homeId, mealId, callback) {
    let deletedStudenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    if (deletedStudenthome.length > 0) {
      const studenthomeIndex = this.db.indexOf(deletedStudenthome[0]);
      let deletedmeals = this.db[studenthomeIndex].meals.filter((e) => {
        return e.id == mealId;
      });
      if (deletedmeals.length > 0) {
        this.db[studenthomeIndex].meals.splice(
          this.db[studenthomeIndex].meals[
            this.db[studenthomeIndex].meals.indexOf(deletedmeals[0])
          ],
          1
        );
        callback(deletedmeals[0], undefined);
      } else {
        let err = {
          message: "meal id doesn't exist",
          errCode: 404,
        };
        if (homeId) {
          err.message += " id: " + mealId;
        }
        callback(undefined, err);
      }
    } else {
      let err = {
        message: "Studenthome id doesn't exist",
        errCode: 404,
      };
      if (homeId) {
        err.message += " id: " + homeId;
      }
      callback(undefined, err);
    }
  },
};

module.exports = database;

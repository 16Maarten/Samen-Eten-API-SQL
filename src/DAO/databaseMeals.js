const logger = require("tracer").colorConsole();
let lastInsertedIndex = 2;
let lastInsertedMealIndex = 1;
const pool = require("./databasePool");
const config = require("./databaseConfig");

let database = {
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

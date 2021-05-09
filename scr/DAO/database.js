const logger = require("tracer").colorConsole();
let lastInsertedIndex = 2;
let lastInsertedMealIndex = 1;

let database = {
  db: [{
    name: "Studentenhuis Breda",
    streetName: "Lovensdijkstraat",
    houseNumber: 45,
    postalCode: "3425FK",
    city: "Breda",
    phoneNumber: "0656341298",
    id: 0,
    meals : [
      {
        mealName:"spaghettie",
        description:"italian food",
        creationDate:"12-10-2021",
        servingDate:"12-12-2021",
        price:"2.50",
        allergicInformation:"tomatoes",
        ingredients: ["pasta","tomatoes"],
        id:0
      }
    ]
  },{
    name: "Studentenhuis Breda",
    streetName: "Lovensdijkstraat",
    houseNumber: 46,
    postalCode: "3425FK",
    city: "Breda",
    phoneNumber: "0656341298",
    id: 1,
    meals : [
      {
        mealName:"spaghettie",
        description:"italian food",
        creationDate:"12-10-2021",
        servingDate:"12-12-2021",
        price:"2.50",
        allergicInformation:"tomatoes",
        ingredients: ["pasta","tomatoes"],
        id:0
      }
    ]
  }],
  info: "This is a database",

  getStudenthome(name, city, callback) {
    let filteredStudenthome = this.db.filter((e) => {
      return e.name == name && e.city == city;
    });
    if (filteredStudenthome.length > 0) {
      callback(filteredStudenthome, undefined);
    } else {
      let err = {
        message: "Studenthome doesn't exist",
        errCode: 404,
      };
      if (name) {
        err.message += " name: " + name;
      }
      if (city) {
        err.message += " city: " + city;
      }
      callback(undefined, err);
    }
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
      if(!item.id){
        item.id = lastInsertedIndex++
        item.meals = []
      }
      this.db.push(item)
      callback(item, undefined)
  },

  addStudenthomeMeal(homeId, item, callback) {
    let studenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    logger.debug("studenthome: "+studenthome[0])
    let studenthomeIndex = this.db.indexOf(studenthome[0])
    if(!item.id){
      item.creationDate = new Date()
      item.id = lastInsertedMealIndex++;
    }
      this.db[studenthomeIndex].meals.push(item)
      callback(item, undefined);
  },

  getStudenthomeMeal(homeId, callback) {
    let Studenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    logger.debug("studentHome: " +Studenthome[0])
    const meals = Studenthome[0].meals
    logger.debug(meals)
      callback(meals, undefined);
  },

  getDetailedStudenthomeMeal(homeId,mealId, callback) {
    let detailedStudenthome = this.db.filter((e) => {
      return e.id == homeId;
    });
    if (detailedStudenthome.length > 0) {
      let detailedmeals = this.db[this.db.indexOf(detailedStudenthome[0])].meals.filter((e) => {
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
      const studenthomeIndex = this.db.indexOf(deletedStudenthome[0])
      let deletedmeals = this.db[studenthomeIndex].meals.filter((e) => {
        return e.id == mealId;
      });
      if (deletedmeals.length > 0) {
        this.db[studenthomeIndex].meals.splice(this.db[studenthomeIndex].meals[this.db[studenthomeIndex].meals.indexOf(deletedmeals[0])],1);
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
}

module.exports = database;

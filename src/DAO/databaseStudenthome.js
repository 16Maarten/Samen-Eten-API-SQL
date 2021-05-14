const logger = require("tracer").colorConsole();
let lastInsertedIndex = 2;
let lastInsertedMealIndex = 1;
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
          }
        );
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
          ],)
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
              item.id = results.insertId
              callback(item, undefined);
            }
          }
        );
      }
    });
  },
};

module.exports = database;

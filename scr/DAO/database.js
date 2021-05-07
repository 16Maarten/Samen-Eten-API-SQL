let lastInsertedIndex = 1;
let input = {
  name: "Studentenhuis Breda",
  streetName: "Lovensdijkstraat",
  houseNumber: "45",
  postalcode: "3425FK",
  city: "Breda",
  phoneNumber: "0656341298",
  id: 0,
};

let database = {
  db: [input],
  info: "This is a database",

  get(name, city, callback) {
    let filteredStudenthome = this.db.filter((e) => {
      return e.name == name && e.city == city;
    });
    if (filteredStudenthome.length > 0) {
      callback(filteredStudenthome, undefined);
    } else {
      let err = {
        message: "Studenthome doesn't exist",
        errCode: 400,
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

  getDetailed(id, callback) {
    let detailedStudenthome = this.db.filter((e) => {
      return e.id == id;
    });
    if (detailedStudenthome.length > 0) {
      callback(detailedStudenthome[0], undefined);
    } else {
      let err = {
        message: "Studenthome id doesn't exist",
        errCode: 400,
      };
      if (id) {
        err.message += " id: " + id;
      }
      callback(undefined, err);
    }
  },

  delete(id, callback) {
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
        errCode: 400,
      };
      if (id) {
        err.message += " id: " + id;
      }
      callback(undefined, err);
    }
  },

  add(item, callback) {
    setTimeout(() => {
      if(!item.id){
        item.id = lastInsertedIndex++;
      }
      this.db.push(item);
      callback(item, undefined);
    }, 2000);
  },
};

module.exports = database;

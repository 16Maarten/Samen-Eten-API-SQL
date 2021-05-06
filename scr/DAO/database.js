let lastInsertedIndex = 1;
let input = {
  name: "Studentenhuis Breda",
  StreetName: "Lovensdijkstraat",
  HouseNumber: "45",
  Postalcode: "3425FK",
  residence: "Breda",
  phoneNumber: "0656341298",
  id: 0
};

let database = {
  db: [input],
  info: "This is a database",

  get(name, city, callback) {
    let filteredStudenthome = this.db.filter((e) => {
        return (
          e.name == name && e.city == city
          )
      });
      if(filteredStudenthome.length > 0){
        callback(filteredStudenthome, undefined);
      } else {
          let err = {
              message: "Studenthome doesn't exist",
              errCode: 400
          }
          if (name) {
            err.message += " name: " + name;
          }
          if (city) {
            err.message += " city: " + city;
          }
          callback(undefined, err);
        }
  },

  add(item, callback) {
    setTimeout(() => {
      item.id = lastInsertedIndex++;
      this.db.push(item);
      callback(item, undefined);
    }, 2000);
  },
};

module.exports = database;

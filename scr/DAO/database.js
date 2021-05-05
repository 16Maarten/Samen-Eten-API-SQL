let lastInsertedIndex = 1
let input = {
    name: "Studentenhuis Breda",
    StreetName: "Lovensdijkstraat",
    HouseNumber: "45",
    Postalcode:"3425FK",
    residence:"Breda",
    phoneNumber:"0656341298"
}

let database = {
    db: [input],
    info : "This is a database",

    get(callback){
        setTimeout(() => {
            callback(db, undefined);
          }, 2000);
    },

    add(item, callback){
        setTimeout(() => {
            this.db.push(item);
            callback(item, undefined);
          }, 2000);    
    }


}

module.exports = database;
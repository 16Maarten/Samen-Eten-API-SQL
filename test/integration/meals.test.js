const logger = require("tracer").colorConsole();
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const pool = require("../../src/DAO/databasePool");
const jwt = require("jsonwebtoken");
const assert = require("assert");

chai.should();
chai.use(chaiHttp);

process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome_testdb";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
logger.info(`Running tests using database '${process.env.DB_DATABASE}'`);

describe("StudentHome", function () {

    const CLEAR_DB = "DELETE IGNORE FROM `meal`";
    const ADD_MEAL_DB ="INSERT INTO `meal` (`ID`, `Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `UserID`, `StudenthomeID`, `MaxParticipants`) VALUES('1', 'Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-02 10:10', 5.50, 1, 1, 10)";
    const ADD_HOME_DB ="INSERT INTO `studenthome` (`ID`, `Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES ('1', 'Princenhage', 'Princenhage', 11, 1,'4706RX','061234567891','Breda')";

    
    describe("Meals", function () {
      before((done) => {
        logger.info("Meal tabel clear");
        pool.query(CLEAR_DB, (err, rows, fields) => {
          if (err) {
            logger.error(`beforeEach CLEAR error: ${err}`);
            done(err);
          } else {
            done();
          }
        });
      });

      before((done) => {
        logger.info("studentHome added");
        pool.query(ADD_HOME_DB, (err, rows, fields) => {
          logger.info("Add studentHome");
          if (err) {
            logger.error(`beforeEach CLEAR error: ${err}`);
            done(err);
          } else {
            done();
          }
        });
      });
    
    
      before((done) => {
        logger.info("Meal added");
        pool.query(ADD_MEAL_DB, (err, rows, fields) => {
          logger.info("Add meal");
          if (err) {
            logger.error(`beforeEach CLEAR error: ${err}`);
            done(err);
          } else {
            done();
          }
        });
      });
    
    
    describe("Create meal", function () {
      it("TC-301-1 Verplicht veld ontbreekt", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/1/meal")
          .set("authorization", "Bearer " + token)
          .send({
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid or missing name");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-301-2 Niet ingelogd", (done) => {
        chai
          .request(server)
          .post("/api/studenthome/1/meal")
          .send({
            "name": "wokkels",
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("error", "datetime");
  
            let { error, datetime } = res.body;
            error.should.be.a("string").that.contains("Authorization header missing!");
            datetime.should.be.a("string")
            done()
          })
      })

      it("TC-301-3 Maaltijdsuccesvol toegevoegd", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/1/meal")
          .set("authorization", "Bearer " + token)
          .send({
            "name": "wokkels",
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "meal");
            let {status, meal } = res.body;
            status.should.be.a("string").that.contains("success")
            meal.should.be.an("object").that.has.all.keys("id", "name", "description", "offerdOn", "price", "allergies", "ingredients", "maxParticipants", "creationDate");
            done()
          })
        })
      })
    })

    describe("Update meal", function () {
      it("TC-302-1 Verplicht veld ontbreekt", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .put("/api/studenthome/1/meal/1")
          .set("authorization", "Bearer " + token)
          .send({
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid or missing name");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-301-2 Niet ingelogd", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/1/meal/1")
          .send({
            "name": "wokkels",
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("error", "datetime");
  
            let { error, datetime } = res.body;
            error.should.be.a("string").that.contains("Authorization header missing!");
            datetime.should.be.a("string")
            done()
          })
      })

      it("TC-302-3 Niet de eigenaar van de data", (done) => {
        jwt.sign({ id: 3 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .put("/api/studenthome/1/meal/1")
          .set("authorization", "Bearer " + token)
          .send({
            "name": "wokkels",
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("error", "datetime");
  
            let { error, datetime } = res.body;
            error.should.be.a("string").that.contains("Not authorized");
            datetime.should.be.a("string")
            done()
          })
        })
      })

      it("TC-302-4 Maaltijd bestaat niet", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .put("/api/studenthome/1/meal/10")
          .set("authorization", "Bearer " + token)
          .send({
            "name": "wokkels",
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist in this studenthome");
            error.should.be.a("string")
            done()
          })
        })
      })

      it("TC-302-5 Maaltijdsuccesvol toegevoegd", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .put("/api/studenthome/1/meal/1")
          .set("authorization", "Bearer " + token)
          .send({
            "name": "wokkels",
            "description": "italian food",
            "offerdOn": "2021-2-6 18:00:00",
            "price": 2.50,
            "allergies": "tomatoes",
            "ingredients": "pasta, tomatoes",
            "maxParticipants": 10
        })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "meal");
            let {status, meal } = res.body;
            status.should.be.a("string").that.contains("success")
            meal.should.be.an("object").that.has.all.keys("name", "description", "offerdOn", "price", "allergies", "ingredients", "maxParticipants");
            done()
          })
        })
      })
    })

    describe("Get meal", function () {
      it("TC-303-1 Lijst van maaltijden geretourneerd", (done) => {
        chai
          .request(server)
          .get("/api/studenthome/1/meal")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "meals");
            let {status, meals } = res.body;
            status.should.be.a("string").that.contains("success")
            meals.should.be.an("array").that.has.a.lengthOf(2)
            done()
          })
        })
    })

    describe("Get detail meal", function () {
      it("TC-304-1 Maaltijd bestaat niet", (done) => {
        chai
          .request(server)
          .get("/api/studenthome/1/meal/4")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist in this studenthome");
            error.should.be.a("string")
            done()
          })
        })

        it("TC-304-2 Details van maaltijd geretourneerd", (done) => {
          chai
            .request(server)
            .get("/api/studenthome/1/meal/1")
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(200)
              res.should.be.an("object")
    
              res.body.should.be.an("object").that.has.all.keys("status", "meal");
              let {status, meal } = res.body;
              status.should.be.a("string").that.contains("success")
              meal.should.be.an("object").that.has.all.keys("ID","Name", "Description", "OfferedOn","MaxParticipants", "Price", "Allergies", "Ingredients","CreatedOn","UserID");
              done()
            })
          })
    })
    describe("Delete meal", function () {
      it("TC-305-2 Niet ingelogd", (done) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/1")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("error", "datetime");
  
            let { error, datetime } = res.body;
            error.should.be.a("string").that.contains("Authorization header missing!");
            datetime.should.be.a("string")
            done()
          })
      })

      it("TC-305-3 Niet de eigenaar van de data", (done) => {
        jwt.sign({ id: 3 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/1")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(401)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("error", "datetime");
  
            let { error, datetime } = res.body;
            error.should.be.a("string").that.contains("Not authorized");
            datetime.should.be.a("string")
            done()
          })
        })
      })

      it("TC-305-4 Maaltijd bestaat niet", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/10")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist in this studenthome");
            error.should.be.a("string")
            done()
          })
        })
      })

      it("TC-305-5 Maaltijdsuccesvol verwijderd", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/1")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "message");
            let {status, message } = res.body;
            status.should.be.a("string").that.contains("success")
            message.should.be.a("string").that.contains("meal deleted")
            done()
          })
        })
      })
    })
  })
}) 
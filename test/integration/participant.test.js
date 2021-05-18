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

    const CLEAR_DB = "DELETE IGNORE FROM `participants`";
    const ADD_PARTICIPANT_DB ="INSERT INTO `participants` (`UserID`, `StudenthomeID`, `MealID`, `SignedUpOn`) VALUES(1,1,1,'2020-01-01 10:10:00')";
    const ADD_MEAL_DB ="INSERT INTO `meal` (`ID`, `Name`, `Description`, `Ingredients`, `Allergies`, `CreatedOn`, `OfferedOn`, `Price`, `UserID`, `StudenthomeID`, `MaxParticipants`) VALUES('1', 'Zuurkool met worst', 'Zuurkool a la Montizaan, specialiteit van het huis.', 'Zuurkool, worst, spekjes', 'Lactose, gluten','2020-01-01 10:10','2020-01-02 10:10', 5.50, 1, 1, 10)";

    describe("Participants", function () {
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

      before((done) => {
        logger.info("participants added");
        pool.query(ADD_PARTICIPANT_DB, (err, rows, fields) => {
          logger.info("Add participant");
          if (err) {
            logger.error(`beforeEach CLEAR error: ${err}`);
            done(err);
          } else {
            done();
          }
        });
      });
    
    describe("signup meal", function () {
        it("TC-401-1 Niet ingelogd", (done) => {
            chai
              .request(server)
              .post("/api/studenthome/1/meal/20/signup")
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

      it("TC-401-2 Maaltijd bestaat niet", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/1/meal/20/signup")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-401-3 Succesvol aangemeld", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/1/meal/1/signup")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "message");
            let {status, message } = res.body;
            status.should.be.a("string").that.contains("success")
            message.should.be.an("String")
            done()
          })
        })
      })
    })

    describe("signup meal", function () {
        it("TC-402-1 Niet ingelogd", (done) => {
            chai
              .request(server)
              .delete("/api/studenthome/2/meal/1/signoff")
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
      it("TC-402-2 Maaltijd bestaat niet", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/20/signoff")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist");
            error.should.be.a("string")
  
            done()
          })
        })
      })

      it("TC-402-3 Aanmelding bestaat niet", (done) => {
        jwt.sign({ id: 3 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/1/signoff")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("user is not singned up");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-402-4 Succesvol afgemeld", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1/meal/1/signoff")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "message");
            let {status, message } = res.body;
            status.should.be.a("string").that.contains("success")
            message.should.be.an("String")
            done()
          })
        })
      })
    })

    describe("participants meal", function () {
        it("TC-403-1 Niet ingelogd", (done) => {
            chai
              .request(server)
              .get("/api/meal/1/participants")
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

      it("TC-403-2 Maaltijd bestaat niet", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .get("/api/meal/20/participants")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-403-3 Lijst van deelnemers geretourneerd", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .get("/api/meal/1/participants")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "participants");
            let {status, participants } = res.body;
            status.should.be.a("string").that.contains("success")
            participants.should.be.an("Array").that.has.a.lengthOf(1)
            done()
          })
        })
      })
    })

    describe("participants detail meal", function () {
        it("TC-404-1 Niet ingelogd", (done) => {
            chai
              .request(server)
              .get("/api/meal/1/participants/2")
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

      it("TC-404-2 Maaltijd bestaat niet", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .get("/api/meal/20/participants/2")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("mealId doesn't exist");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-404-3 Lijst van deelnemers geretourneerd", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .get("/api/meal/1/participants/2")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "participant");
            let {status, participant } = res.body;
            status.should.be.a("string").that.contains("success")
            participant.should.be.an("object").that.has.all.keys("Email", "First_Name", "Last_Name", "Student_Number", "ID");
            done()
          })
        })
      })
    })

    })
  }) 
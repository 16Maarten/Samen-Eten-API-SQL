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

    const CLEAR_DB = "DELETE IGNORE FROM `studenthome`";
    const ADD_HOMES_DB =   "INSERT INTO `studenthome` (`ID`, `Name`, `Address`, `House_Nr`, `UserID`, `Postal_Code`, `Telephone`, `City`) VALUES ('1', 'Princenhage', 'Princenhage', 11, 1,'4706RX','061234567891','Breda'),('2', 'Haagdijk 23', 'Haagdijk', 4, 1, '4706RX','061234567891','Breda')";
    
    describe("StudentHome", function () {
      beforeEach((done) => {
        logger.info("studenthome tabel clear");
        pool.query(CLEAR_DB, (err, rows, fields) => {
          if (err) {
            logger.error(`before CLEAR error: ${err}`);
            done(err);
          } else {
            done();
          }
        });
      });


      beforeEach((done) => {
        logger.info("studenthome added");
        pool.query(ADD_HOMES_DB, (err, rows, fields) => {
          if (err) {
            logger.error(`before CLEAR error: ${err}`);
            done(err);
          } else {
            done();
          }
        });
      });
    
    describe("Create studenthome", function () {
      it("TC-201-1 Verplicht veld ontbreekt", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Studentenhuis Breda",
            address: "Lovensdijkstraat",
            postalCode: "3425FK",
            city: "Breda",
            telephone: "0656341298",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid or missing houseNumber");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      
      it("TC-201-2 Invalide postcode", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Studentenhuis Breda",
            address: "Lovensdijkstraat",
            houseNumber: 45,
            postalCode: "342532FK",
            city: "Breda",
            telephone: "0656341298",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid postalCode");
            error.should.be.a("string")
  
            done()
          })
        })
      })

      it("TC-201-3 Invalide telefoonnummer", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Studentenhuis Breda",
            address: "Lovensdijkstraat",
            houseNumber: 45,
            postalCode: "3425FK",
            city: "Breda",
            telephone: "06563412988498",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid telephone");
            error.should.be.a("string")
  
            done()
          })
        })
      })
      it("TC-201-4 Studentenhuis bestaat al op dit adres (bestaandpostcode/huisnummer)", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Princenhage",
            address: "Princenhage",
            houseNumber: 11,
            postalCode: "4706RX",
            city: "Breda",
            telephone: "061234567891",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Studenthome already exists");
            error.should.be.a("string")
  
            done()
          })
        })
      })

      it("TC-201-5 Niet ingelogd", (done) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .send({
            name: "Studentenhuis Dordrecht",
            address: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
            telephone: "0656341298",
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

      it("TC-201-6 Studentenhuis  succesvol toegevoegd", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .set("authorization", "Bearer " + token)
          .send({
            name: "Studentenhuis Dordrecht",
            address: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
            telephone: "0656341298",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthome");
            let { status, studenthome } = res.body;
            status.should.be.a("string").that.contains("success")
            studenthome.should.be.an("object").that.has.all.keys("id", "name", "address", "houseNumber", "userId", "postalCode", "telephone", "city");
            done()
          })
        })
      })
    })


    describe("Get studenthome", function () { 
      describe("studenthome null", function () {
        beforeEach((done) => {
          logger.info("studenthome tabel clear");
          pool.query(CLEAR_DB, (err, rows, fields) => {
            if (err) {
              logger.error(`beforeEach CLEAR error: ${err}`);
              done(err);
            } else {
              done();
            }
          });
      it("TC-202-1 Toon nul studentenhuizen", (done) => {        
        chai
          .request(server)
          .get("/api/studenthome")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthomes");
            let { status, studenthomes } = res.body;
            status.should.be.an("string").that.contains("success")
            studenthomes.should.be.an("array").that.has.a.lengthOf(0)
            done()
          })
      })
    })
  }); 

      it("TC-202-2 Toon twee studentenhuizen", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?city=Breda")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthomes");
            let { status, studenthomes } = res.body;
            status.should.be.an("string").that.contains("success")
            studenthomes.should.be.an("array").that.has.a.lengthOf(2)
            done()
          })
      })

      it("TC-202-3 Toon studentenhuizen met zoekterm op niet-bestaande stad", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?city=papendrecht")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("No studentHome was found on city:");
            error.should.be.a("string")
            done()
          })
      })

      it("TC-202-4 Toon studentenhuizen met zoekterm op niet-bestaande naam", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Studentenhuis Papendrecht")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("No studentHome was found on name:");
            error.should.be.a("string")
            done()
          })
      })

      it("TC-202-5 Toon studentenhuizen met zoekterm op bestaande stad", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?city=Breda")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthomes");
  
            let { status, studenthomes } = res.body;
            status.should.be.a("string").that.contains("success");
            studenthomes.should.be.an("Array").that.has.a.lengthOf(2)
            done()
          })
      })

      it("TC-202-6 Toon studentenhuizen met zoekterm op bestaande naam", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Princenhage")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthomes");
  
            let { status, studenthomes } = res.body;
            status.should.be.a("string").that.contains("success");
            studenthomes.should.be.an("Array").that.has.a.lengthOf(1)
            done()
          })
      })
    })

    describe("Get detail studenthome", function () {
      it("TC-203-1 Studentenhuis-ID bestaat niet", (done) => {
        chai
          .request(server)
          .get("/api/studenthome/5")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("studenthomeId doesn't exist");
            error.should.be.a("string")
            done()
          })
      })

      it("TC-203-2 Studentenhuis-ID bestaat", (done) => {
        chai
          .request(server)
          .get("/api/studenthome/1")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "result");
            let { status, result } = res.body;
            status.should.be.a("string").that.contains("success");
            result.should.be.an("object").that.has.all.keys("ID", "Name", "Address", "House_Nr", "UserID", "Postal_Code", "Telephone", "City");
            done()
          })
      })
    })

    describe("Update studenthome", function () {
      it("TC-204-1 Verplicht veld ontbreekt", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + token)
            .send({
              name: "Studentenhuis Breda",
              address: "Lovensdijkstraat",
              postalCode: "3425FK",
              city: "Breda",
              telephone: "0656341298",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400)
              res.should.be.an("object")
    
              res.body.should.be.an("object").that.has.all.keys("message", "error");
    
              let { message, error } = res.body;
              message.should.be.a("string").that.contains("Invalid or missing houseNumber");
              error.should.be.a("string")
    
              done()
            })
          })
      })

      it("TC-204-2 Invalide postcode", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + token)
            .send({
              name: "Studentenhuis Breda",
              address: "Lovensdijkstraat",
              houseNumber: 15,
              postalCode: "342532FK",
              city: "Breda",
              telephone: "0656341298",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400)
              res.should.be.an("object")
    
              res.body.should.be.an("object").that.has.all.keys("message", "error");
    
              let { message, error } = res.body;
              message.should.be.a("string").that.contains("Invalid postalCode");
              error.should.be.a("string")
    
              done()
            })
          })
      })
      it("TC-204-3 Invalide telefoonnummer", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + token)
            .send({
              name: "Studentenhuis Breda",
              address: "Lovensdijkstraat",
              houseNumber: 15,
              postalCode: "3425FK",
              city: "Breda",
              telephone: "0656341293434244358",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400)
              res.should.be.an("object")
    
              res.body.should.be.an("object").that.has.all.keys("message", "error");
    
              let { message, error } = res.body;
              message.should.be.a("string").that.contains("Invalid telephone");
              error.should.be.a("string")
    
              done()
            })
          })
      })
      it("TC-204-4 Studentenhuis bestaat niet", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
          chai
            .request(server)
            .put("/api/studenthome/-1")
            .set("authorization", "Bearer " + token)
            .send({
              name: "Studentenhuis Breda",
              address: "Lovensdijkstraat",
              houseNumber: 15,
              postalCode: "3425FK",
              city: "Breda",
              telephone: "0656341298",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(400)
              res.should.be.an("object")
    
              res.body.should.be.an("object").that.has.all.keys("message", "error");
    
              let { message, error } = res.body;
              message.should.be.a("string").that.contains("studenthomeId doesn't exist");
              error.should.be.a("string")
    
              done()
            })
          })
      })

      it("TC-204-5 Niet ingelogd", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/1")
          .send({
            name: "Studentenhuis Dordrecht",
            address: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
            telephone: "0656341298",
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

      it("TC-204-6 | Studentenhuis bestaat in databaseStudentenhuis heeft identificatienr.Responsestatus HTTP code 200 (OK)Response bevat JSON object met alle gegevens van het studentenhuis.", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
          chai
            .request(server)
            .put("/api/studenthome/1")
            .set("authorization", "Bearer " + token)
            .send({
              name: "Studentenhuis Dordrecht",
              address: "pietrijsdijkstraat",
              houseNumber: 40,
              postalCode: "3425FK",
              city: "Dordrecht",
              telephone: "0656341298",
            })
            .end((err, res) => {
              assert.ifError(err);
              res.should.have.status(200)
              res.should.be.an("object")
    
              res.body.should.be.an("object").that.has.all.keys("status", "studenthome");
              let { status, studenthome } = res.body;
              status.should.be.a("string").that.contains("success")
              studenthome.should.be.an("object").that.has.all.keys("name", "address", "houseNumber", "postalCode", "telephone", "city");
              done()
            })
          })
      })
    })

    describe("delete studenthome", function () {
      it("TC-205-1 Studentenhuis bestaat niet", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/45")
          .set("authorization", "Bearer " + token)
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("studenthomeId doesn't exist");
            error.should.be.a("string")
  
            done()
          })
        })
      })

      it("TC-205-2 Niet ingelogd", (done) => {
        chai
          .request(server)
          .delete("/api/studenthome/1")
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

      it("TC-205-3 Actor is geen eigenaar", (done) => {
        jwt.sign({ id: 2 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1")
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

      it("TC-205-4 Studentenhuis  succesvol verwijderd", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .delete("/api/studenthome/1")
          .set("authorization", "Bearer " + token)
          .send({
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "message");
            let { status, message } = res.body;
            status.should.be.a("string").that.contains("success")
            message.should.be.a("string").that.contains("Studenthome deleted")
            done()
          })
      })
    })
    })

    describe("add Administrator", function () {
      it("TC-206-1 Studentenhuis bestaat niet", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/45/user")
          .set("authorization", "Bearer " + token)
          .send({
            id: 2,
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("studenthomeId doesn't exist");
            error.should.be.a("string")
  
            done()
          })
        })
      })

      it("TC-206-2 Niet ingelogd", (done) => {
        chai
          .request(server)
          .post("/api/studenthome/2/user")
          .send({
            id: 2,
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

      it("TC-206-3 gebruiker die niet bestaat proberen toe te voegen", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/2/user")
          .send({
            id: 3,
          })
          .set("authorization", "Bearer " + token)
          .send({
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("User doesn't exist");
            error.should.be.a("string")
            done()
          })
      })
    })


      it("TC-206-4 gebruiker succesvol toegevoegd", (done) => {
        jwt.sign({ id: 1 }, "secret", { expiresIn: "2h" }, (er, token) => {
        chai
          .request(server)
          .post("/api/studenthome/2/user")
          .send({
            id: 2,
          })
          .set("authorization", "Bearer " + token)
          .send({
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "message");
            let { status, message } = res.body;
            status.should.be.a("string").that.contains("success")
            message.should.be.a("string").that.contains("Administrator added with id")
            done()
          })
      })
    })
    })

  })
}) 
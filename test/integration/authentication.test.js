const logger = require("tracer").colorConsole();
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = require("assert");
const server = require("../../server");
const pool = require("../../src/DAO/databasePool");

chai.should();
chai.use(chaiHttp);

process.env.DB_DATABASE = process.env.DB_DATABASE || "studenthome_testdb";
process.env.NODE_ENV = "testing";
process.env.LOGLEVEL = "error";
logger.info(`Running tests using database '${process.env.DB_DATABASE}'`);

const CLEAR_DB = "DELETE IGNORE FROM `user`";
const ADD_USER_DB =
  "INSERT INTO `user` (`First_Name`, `Last_Name`, `Email`, `Student_Number`, `Password`) VALUES('Jan', 'Smit', 'jsmit@server.nl','222222', 'secret')";

describe("Authentication", () => {
  before((done) => {
    logger.info("User tabel clear");
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
    pool.query(ADD_USER_DB, (err, rows, fields) => {
      logger.info("Add user");
      if (err) {
        logger.error(`beforeEach CLEAR error: ${err}`);
        done(err);
      } else {
        done();
      }
    });
  });

  describe("Registation", () => {
    it("TC-101-1 Verplicht veld ontbreekt", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          lastname: "LastName",
          email: "test@test.nl",
          studentnr: 1234567,
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be
            .a("string")
            .that.contains("Invalid or missing firstname");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-101-2 Invalide email adres", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "FirstName",
          lastname: "LastName",
          email: "test58test.nl",
          student_Number: 1234567,
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.contains("Invalid email");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-101-3 Invalide wachtwoord", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "FirstName",
          lastname: "LastName",
          email: "test@test.nl",
          student_Number: 1234567,
          password: 983798327,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be
            .a("string")
            .that.contains("Invalid or missing password");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-101-4 Gebruiker bestaat al", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "Jan",
          lastname: "Smit",
          email: "jsmit@server.nl",
          student_Number: 1234567,
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be
            .a("string")
            .that.contains("This email has already been taken.");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-101-5 Gebruiker succesvol geregistreerd", (done) => {
      chai
        .request(server)
        .post("/api/register")
        .send({
          firstname: "henk",
          lastname: "vis",
          email: "henkVis@server.nl",
          student_Number: 1234567,
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object").that.has.all.keys("status", "user");

          let { status, user } = res.body;
          status.should.be.a("string").that.contains("success");
          user.should.be.an("object").that.has.all.keys("emailAdress", "token");
          done();
        });
    });
  });

  describe("UC102 Login", () => {
    it("TC-102-1 Verplicht veld ontbreekt", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .send({
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be
            .a("string")
            .that.contains("Invalid or missing email");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-102-2 Invalide email adres", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .send({
          email: "testtest.nl",
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be.a("string").that.contains("Invalid email");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-102-3 Invalide wachtwoord", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .send({
          email: "test@test.nl",
          password: 12234,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be
            .a("string")
            .that.contains("Invalid or missing password");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-102-4 Gebruiker bestaat niet", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .send({
          email: "jsmit@server.nl",
          password: "gerrit",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an("object").that.has.all.keys("message", "error");

          let { message, error } = res.body;
          message.should.be
            .a("string")
            .that.contains("User not found or password invalid");
          error.should.be.a("string");
          done();
        });
    });

    it("TC-101-5 Gebruiker succesvol geregistreerd", (done) => {
      chai
        .request(server)
        .post("/api/login")
        .send({
          email: "jsmit@server.nl",
          password: "secret",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object").that.has.all.keys("status", "user");

          let { status, user } = res.body;
          status.should.be.a("string").that.contains("success");
          user.should.be.an("object").that.has.all.keys("emailAdress", "token");
          done();
        });
    });
  });
});

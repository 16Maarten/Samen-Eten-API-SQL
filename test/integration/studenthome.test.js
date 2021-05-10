const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = require("assert");
const server = require("../../server");

chai.should();
chai.use(chaiHttp);

describe("StudentHome", function () {
    ///// UC-201 Maak studentenhuis /////
    // TODO: TC-201-5 | Niet ingelogd zie blz.28
    describe("create", function () {
      it("TC-201-1 | Studentenhuis is niet toegevoegdResponsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie.", (done) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .send({
            name: "Studentenhuis Breda",
            streetName: "Lovensdijkstraat",
            postalCode: "3425FK",
            city: "Breda",
            phoneNumber: "0656341298",
            meals: [],
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid or missing");
            error.should.be.a("string")
  
            done()
          })
      })
      it("TC-201-2 | Studentenhuis is niet toegevoegdResponsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie.", (done) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .send({
            name: "Studentenhuis Breda",
            streetName: "Lovensdijkstraat",
            houseNumber: 45,
            postalCode: "342532FK",
            city: "Breda",
            phoneNumber: "0656341298",
            meals: [],
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
      it("TC-201-3 | Studentenhuis is niet toegevoegdResponsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie.", (done) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .send({
            name: "Studentenhuis Breda",
            streetName: "Lovensdijkstraat",
            houseNumber: 45,
            postalCode: "3425FK",
            city: "Breda",
            phoneNumber: "06563412988498",
            meals: [],
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Invalid phoneNumber");
            error.should.be.a("string")
  
            done()
          })
      })
      it("TC-201-4 | Studentenhuis is niet toegevoegdResponsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie.", (done) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .send({
            name: "Studentenhuis Breda",
            streetName: "Lovensdijkstraat",
            houseNumber: 45,
            postalCode: "3425FK",
            city: "Breda",
            phoneNumber: "0656341298",
            meals: [],
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

      it("TC-201-6 | Studentenhuis bestaat in databaseStudentenhuis heeft identificatienr.Responsestatus HTTP code 200 (OK)Response bevat JSON object met alle gegevens van het studentenhuis.", (done) => {
        chai
          .request(server)
          .post("/api/studenthome")
          .send({
            name: "Studentenhuis Breda",
            streetName: "Lovensdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Breda",
            phoneNumber: "0656341298",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthome");
            let { status, studenthome } = res.body;
            status.should.be.a("string").that.contains("success")
            studenthome.should.be.an("object")
            done()
          })
      })

      it("TC-202-1 | Responsestatus HTTP code 200Response bevat JSON object met lege lijst.", (done) => {
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
}) 
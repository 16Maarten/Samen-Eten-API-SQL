const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = require("assert");
const server = require("../../server");

chai.should();
chai.use(chaiHttp);

describe("StudentHome", function () {
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
            name: "Studentenhuis Dordrecht",
            streetName: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
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

      it("TC-202-2 | Responsestatus HTTP code 200Response bevat JSON object met gegevens van twee studentenhuizen", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Studentenhuis Breda&city=Breda")
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

      it("TC-202-3 | Responsestatus HTTP code 404Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding.", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Studentenhuis Papendrecht&city=papendrecht")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Studenthome doesn't exist");
            error.should.be.a("string")
            done()
          })
      })

      it("TC-202-4 | Responsestatus HTTP code 404Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding.", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Studentenhuis Papendrecht&city=papendrecht")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Studenthome doesn't exist");
            error.should.be.a("string")
            done()
          })
      })

      it("TC-202-5 | Responsestatus HTTP code 200Response bevat JSON object met gegevens van studentenhuizen.", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Studentenhuis Papendrecht&city=Breda")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthomes");
  
            let { status, studenthomes } = res.body;
            status.should.be.a("string").that.contains("success");
            studenthomes.should.be.an("Array")
            done()
          })
      })

      it("TC-202-6 | Responsestatus HTTP code 200Response bevat JSON object met gegevens van studentenhuizen.", (done) => {
        chai
          .request(server)
          .get("/api/studenthome?name=Studentenhuis Breda&city=papendrecht")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthomes");
  
            let { status, studenthomes } = res.body;
            status.should.be.a("string").that.contains("success");
            studenthomes.should.be.an("Array")
            done()
          })
      })

      it("TC-203-1 | Responsestatus HTTP code 404Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding.", (done) => {
        chai
          .request(server)
          .get("/api/studenthome/5")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Studenthome id doesn't exist id: 5");
            error.should.be.a("string")
            done()
          })
      })

      it("TC-203-2 | Responsestatus HTTP code 200Response bevat JSON object met gegevens van studentenhuis.", (done) => {
        chai
          .request(server)
          .get("/api/studenthome/0")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "result");
            let { status, result } = res.body;
            status.should.be.a("string").that.contains("success");
            result.should.be.an("object").that.eql(
              {
              "name": "Studentenhuis Breda",
              "streetName": "Lovensdijkstraat",
              "houseNumber": 45,
              "postalCode": "3425FK",
              "city": "Breda",
              "phoneNumber": "0656341298",
              "id": 0,
              "meals": [
                  {
                      "mealName": "spaghettie",
                      "description": "italian food",
                      "creationDate": "12-10-2021",
                      "servingDate": "12-12-2021",
                      "price": "2.50",
                      "allergicInformation": "tomatoes",
                      "ingredients": ["pasta","tomatoes"],
                      "id": 0
                  }
              ]
          })
            done()
          })
      })

      it("TC-204-1 | Responsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .send({
            name: "Studentenhuis Dordrecht",
            streetName: "pietrijsdijkstraat",
            postalCode: "3425FK",
            city: "Dordrecht",
            phoneNumber: "0656341298",
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
      it("TC-204-2 | Responsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .send({
            name: "Studentenhuis Dordrecht",
            streetName: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "342532FK",
            city: "Dordrecht",
            phoneNumber: "0656341298",
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
      it("TC-204-3 | Responsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .send({
            name: "Studentenhuis Dordrecht",
            streetName: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
            phoneNumber: "06563412988498",
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
      it("TC-204-4 | Responsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/7")
          .send({
            name: "Studentenhuis Dordrecht",
            streetName: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
            phoneNumber: "0656341298",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(400)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Studenthome id doesn't exist id: 7");
            error.should.be.a("string")
  
            done()
          })
      })

      it("TC-204-6 | Studentenhuis bestaat in databaseStudentenhuis heeft identificatienr.Responsestatus HTTP code 200 (OK)Response bevat JSON object met alle gegevens van het studentenhuis.", (done) => {
        chai
          .request(server)
          .put("/api/studenthome/0")
          .send({
            name: "Studentenhuis Dordrecht",
            streetName: "pietrijsdijkstraat",
            houseNumber: 50,
            postalCode: "3425FK",
            city: "Dordrecht",
            phoneNumber: "0656341298",
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthome");
            let { status, studenthome } = res.body;
            status.should.be.a("string").that.contains("success")
            studenthome.should.be.an("object").that.eql(
              {
              "name": "Studentenhuis Dordrecht",
              "streetName": "pietrijsdijkstraat",
              "houseNumber": 50,
              "postalCode": "3425FK",
              "city": "Dordrecht",
              "phoneNumber": "0656341298",
              "id": 0,
              "meals": [
                  {
                      "mealName": "spaghettie",
                      "description": "italian food",
                      "creationDate": "12-10-2021",
                      "servingDate": "12-12-2021",
                      "price": "2.50",
                      "allergicInformation": "tomatoes",
                      "ingredients": ["pasta","tomatoes"],
                      "id": 0
                  }
              ]
          }
          )
            done()
          })
      })
      it("TC-205-1 | Responsestatus HTTP code 400Response bevat JSON object met daarin generieke foutinformatie, met specifieke foutmelding", (done) => {
        chai
          .request(server)
          .delete("/api/studenthome/7")
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(404)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("message", "error");
  
            let { message, error } = res.body;
            message.should.be.a("string").that.contains("Studenthome id doesn't exist id: 7");
            error.should.be.a("string")
  
            done()
          })
      })

      it("TC-205-2 | Studentenhuis bestaat in databaseStudentenhuis heeft identificatienr.Responsestatus HTTP code 200 (OK)Response bevat JSON object met alle gegevens van het studentenhuis.", (done) => {
        chai
          .request(server)
          .delete("/api/studenthome/0")
          .send({
          })
          .end((err, res) => {
            assert.ifError(err);
            res.should.have.status(200)
            res.should.be.an("object")
  
            res.body.should.be.an("object").that.has.all.keys("status", "studenthome");
            let { status, studenthome } = res.body;
            status.should.be.a("string").that.contains("success")
            studenthome.should.be.an("object").that.eql(
              {
              "name": "Studentenhuis Dordrecht",
              "streetName": "pietrijsdijkstraat",
              "houseNumber": 50,
              "postalCode": "3425FK",
              "city": "Dordrecht",
              "phoneNumber": "0656341298",
              "id": 0,
              "meals": [
                  {
                      "mealName": "spaghettie",
                      "description": "italian food",
                      "creationDate": "12-10-2021",
                      "servingDate": "12-12-2021",
                      "price": "2.50",
                      "allergicInformation": "tomatoes",
                      "ingredients": ["pasta","tomatoes"],
                      "id": 0
                  }
              ]
          }
          )
            done()
          })
      })
    })
}) 
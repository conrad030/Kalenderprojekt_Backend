const chai = require("chai");
const app = require("../../src/Server");
const chaiHttp = require("chai-http");
const groupService = require("../../src/services/groupService");
var cookies;

// Config
chai.use(chaiHttp);
chai.should();

// Initial Login
describe("POST", () => {
  it("should log in dummy user", (done) => {
    chai
      .request(app)
      .post("/users/login")
      .set("Authorization", "Bearer dGVzdDphYmM=")
      .end((err, res) => {
        try {
          res.should.have.cookie("session_cookie");
          res.should.have.status(200);
          cookies = res.headers["set-cookie"].pop().split(";")[0];
          console.log(cookies);
        } catch (err) {
          console.log(err.message);
        }
        done();
      });
  });
});

//Create
describe("POST", () => {
  it("should create one group", (done) => {
    chai
      .request(app)
      .post("/groups/create")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .send({ name: "testGroup", password: "testPassword" })
      .end((err, res) => {
        res.should.have.status(201);
        done();
        res.body.should.be.a("object");
      });
  });
});

// Get all
describe("GET", () => {
  it("should get all groups", (done) => {
    chai
      .request(app)
      .get("/groups/")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
});

// Get one
describe("GET", () => {
  it("should get one group", (done) => {
    chai
      .request(app)
      .get("/groups/")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, allGroups) => {
        chai
          .request(app)
          .get("/groups/" + allGroups.body.at(-1).id)
          .set("Content-Type", "application/json")
          .set("cookie", cookies)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");

            done();
          });
      });
  });
});

// Update
describe("PUT", () => {
  it("should update one group", (done) => {
    chai
      .request(app)
      .get("/groups/")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, allGroups) => {
        chai
          .request(app)
          .put("/groups/" + allGroups.body.at(-1).id)
          .set("Content-Type", "application/json")
          .set("cookie", cookies)
          .send({ name: "changedGroupName", password: "changedPassword" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");

            done();
          });
      });
  });
});

// Delete
describe("DELETE", () => {
  it("should delete one group", (done) => {
    chai
      .request(app)
      .get("/groups/")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, allGroups) => {
        chai
          .request(app)
          .delete("/groups/" + allGroups.body.at(-1).id)
          .set("Content-Type", "application/json")
          .set("cookie", cookies)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");

            done();
          });
      });
  });
});

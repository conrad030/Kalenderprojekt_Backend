const chai = require("chai");
const app = require("../../src/Server");
const groupService = require("../../src/services/groupService");
var agent;

// Initial Login
describe("POST", () => {
  it("should log in dummy user", (done) => {
    agent = chai.request.agent(app);
    agent
      .post("/users/login")
      .set("Authorization", "Bearer dGVzdDphYmM=")
      .then((res) => {
        try {
          res.should.have.cookie("session_cookie");
          res.should.have.status(200);
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
    agent
      .post("/groups/create")
      .set("Content-Type", "application/json")
      .send({ name: "testGroup", password: "testPassword" })
      .then((res) => {
        console.log(res.body.json());
        res.should.have.status(201);
        res.body.should.be.a("object");
        done();
      });
  });
});

// Get all
describe("GET", () => {
  it("should get all groups", (done) => {
    chai
      .request(app)
      .get("/groups/")
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
      .end((err, allGroups) => {
        chai

          .request(app)
          .get("/groups/" + allGroups.body.at(-1).id)
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
      .end((err, allGroups) => {
        chai
          .request(app)
          .put("/groups/" + allGroups.body.at(-1).id)
          .set("Content-Type", "application/json")
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
      .end((err, allGroups) => {
        chai
          .request(app)
          .delete("/groups/" + allGroups.body.at(-1).id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");

            done();
          });
      });
  });
});

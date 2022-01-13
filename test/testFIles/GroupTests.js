const chai = require("chai");
const app = require("../../src/Server");
const groupService = require("../../src/services/groupService");

//Create
describe("POST", () => {
  it("should create one group", (done) => {
    chai
      .request(app)
      .post("/groups/create")
      .set("Content-Type", "application/json")
      .send({ name: "testGroup", password: "testPassword" })
      .end((err, res) => {
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

const chai = require("chai");
const app = require("../../src/Server");
var cookies;
let allGroups;
let allTeams;

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
        } catch (err) {
          console.log(err.message);
        }
        done();
      });
  });
});

// Get all groups
describe("GET", () => {
  it("should get all groups", (done) => {
    chai
      .request(app)
      .get("/groups/")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a("array");
        allGroups = res.body;
        done();
      });
  });
});

//Create team
describe("POST", () => {
  it("should create one team", (done) => {
    chai
      .request(app)
      .post("/teams")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .send({
        groupId: allGroups.at(-1).id,
        name: "chaiTeam",
        colorCode: "FFFFFF",
      })
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(201);
        done();
        res.body.should.be.a("object");
      });
  });
});

// Get all teams
describe("GET", () => {
  it("should get all teams", (done) => {
    chai
      .request(app)
      .get("/teams/")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a("array");
        allTeams = res.body;
        done();
      });
  });
});

// Get one team
describe("GET", () => {
  it("should get one team", (done) => {
    chai
      .request(app)
      .get(`/teams/${allTeams.at(-1).id}`)
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

// Update team
describe("PUT", () => {
  it("should update one team", (done) => {
    chai
      .request(app)
      .put(`/teams/${allTeams.at(-1).id}`)
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .send({
        groupId: allGroups.at(-1).id,
        name: "changedChaiTeam",
        colorCode: "BBBBBB",
      })
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

// Delete team
describe("DELETE", () => {
  it("should delete one team", (done) => {
    chai
      .request(app)
      .delete(`/teams/${allTeams.at(-1).id}`)
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

// Delete group
describe("DELETE", () => {
  it("should delete one group", (done) => {
    chai
      .request(app)
      .delete(`/groups/${allGroups.at(-1).id}`)
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        if (err) console.log(err);
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

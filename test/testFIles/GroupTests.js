const chai = require("chai");
const app = require("../../src/Server");
let allGroups;
var cookies;

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

//Create
describe("POST", () => {
  it("should create one group", (done) => {
    chai
      .request(app)
      .post("/groups/create")
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .send({ name: "chaiGroup", password: "chaiPW" })
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
        allGroups = res.body;
        done();
      });
  });
});

/**
 * ! Doesn't work yet, need to create another user first and add them
 */
// Add user to group
// describe("POST", () => {
//   it("should add user to new group", (done) => {
//     let invCode = allGroups.at(-1).invitationCode;
//     chai
//       .request(app)
//       .get(`/groups/invitation/${invCode}`)
//       .set("Content-Type", "application/json")
//       .set("cookie", cookies)
//       .end((err, res) => {
//         if (err) console.log(err.message);
//         res.should.have.status(200);
//         done();
//       });
//   });
// });

// Get one
describe("GET", () => {
  it("should get one group", (done) => {
    chai
      .request(app)
      .get(`/groups/${allGroups.at(-1).id}`)
      .set("Content-Type", "application/json")
      .set("cookie", cookies)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

// Update
describe("PUT", () => {
  it("should update one group", (done) => {
    chai
      .request(app)
      .put(`/groups/${allGroups.at(-1).id}`)
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

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/Server");
const groupService = require("../src/services/groupService");

// Configure chai

chai.use(chaiHttp);
chai.should();

// GROUPS
describe("Groups", () => {
  require("./testFiles/GroupTests");
});

// describe("Teams", () => {
//   describe("POST", () => {
//     it("should create one team in group", (done) => {
//       chai
//         .request(app)
//         .post("/teams/create")
//         .set("Content-Type", "application-json")
//         .send({ groupId: "" });
//     });
//   });
// });

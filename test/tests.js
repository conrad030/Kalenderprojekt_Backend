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
  require("./testFiles/TeamTests");
});

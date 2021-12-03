const { Sequelize, sequelize } = require("sequelize/dist");

module.exports = (sequelize, Sequelize) => {
  const Team = sequelize.define("team", {
    //   field: {
    //     type: Sequelize.STRING,
    //   },
  });
  return Team;
};

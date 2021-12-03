const { Sequelize, sequelize } = require("sequelize/dist");

module.exports = (sequelize, Sequelize) => {
  const Group = sequelize.define("group", {
    //   field: {
    //     type: Sequelize.STRING,
    //   },
  });
  return Group;
};

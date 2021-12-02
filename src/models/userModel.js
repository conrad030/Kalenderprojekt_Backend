const { Sequelize, sequelize } = require("sequelize/dist");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    //   field: {
    //     type: Sequelize.STRING,
    //   },
  });
  return User;
};

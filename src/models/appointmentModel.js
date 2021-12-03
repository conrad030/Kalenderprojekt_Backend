const { Sequelize, sequelize } = require("sequelize/dist");

module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("event", {
    //   field: {
    //     type: Sequelize.STRING,
    //   },
  });
  return Event;
};

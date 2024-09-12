const { connection } = require("../../db/");
const { DataTypes } = require("sequelize");

const Team = connection.define(
  "team",
  {
    teamName: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: true }
);

module.exports = Team;

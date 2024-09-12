const { connection } = require("../../db/");
const { DataTypes } = require("sequelize");

const User = connection.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("member", "owner"),
    },
  },
  { timestamps: true }
);

module.exports = User;

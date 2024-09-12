const { connection } = require("../../db/");
const { DataTypes, DATE } = require("sequelize");

const Pull_Request = connection.define(
  "pull_request",
  {
    repo_url: {
      type: DataTypes.STRING,
    },
    pr_number: {
      type: DataTypes.INTEGER,
    },
    pr_status: {
      type: DataTypes.ENUM("open", "closed"),
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: false }
);

module.exports = Pull_Request;

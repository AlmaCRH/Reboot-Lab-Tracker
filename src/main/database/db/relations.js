const Lab = require("../api/models/lab.model");
const User = require("../api/models/user.model");
const Team = require("../api/models/team.model");
const Pull_request = require("../api/models/pull_request.model");

const addRelationsToModels = () => {
  try {
    User.hasMany(Pull_request);
    Pull_request.belongsTo(User);

    Lab.hasMany(Pull_request);
    Pull_request.belongsTo(Lab);

    User.belongsToMany(Team, {
      through: "teams_users",
      timestamps: false,
    });
    Team.belongsToMany(User, {
      through: "teams_users",
      timestamps: false,
    });

    Team.belongsToMany(Lab, {
      through: "teams_labs",
      timestamps: false,
    });
    Lab.belongsToMany(Team, {
      through: "teams_labs",
      timestamps: false,
    });
    console.log("Relations added to all models");
  } catch (error) {
    console.error(error);
  }
};

module.exports = addRelationsToModels;

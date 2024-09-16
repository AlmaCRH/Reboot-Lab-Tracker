const { api } = require("./instance");

const createTeamAndUsers = async (team, members) => {
  try {
    const response = await api.post("teams/members", {
      team: team,
      members: members,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createTeamAndUsers };

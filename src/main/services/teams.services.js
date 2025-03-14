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

const addLabToTeam = async (body) => {
  try {
    const response = await api.post("teams/labs", body);
    return response;
  } catch (error) {
    console.error(error.code);
  }
};

const getUsersWithTeamsAndPullsByLab = async (teamName, labName) => {
  try {
    const { data } = await api.get("teams/members", {
      params: {
        teamName: teamName,
        labName: labName,
      },
    });
    return data === undefined ? null : data;
  } catch (error) {
    console.error(error.code);
  }
};

const getTeamAndLab = async () => {
  try {
    const { data } = await api.get("teams/labs");
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createTeamAndUsers,
  getUsersWithTeamsAndPullsByLab,
  addLabToTeam,
  getTeamAndLab,
};

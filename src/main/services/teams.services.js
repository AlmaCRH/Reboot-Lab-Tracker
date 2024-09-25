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
    console.error(error);
  }
};

const getUsersWithTeamsAndPullsByLab = async (teamName) => {
  try {
    const { data } = await api.get("teams/members", {
      params: {
        teamName: teamName,
        labName: labName,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
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

const { api } = require("./instance.js");

const createPullsWithUsersAndLab = async (body) => {
  try {
    const response = await api.post("/pulls/users", body);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getPullsByUsers = async (userId) => {
  try {
    const { data } = await api.get(`/pulls/users`, { params: { userId } });
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createPullsWithUsersAndLab, getPullsByUsers };

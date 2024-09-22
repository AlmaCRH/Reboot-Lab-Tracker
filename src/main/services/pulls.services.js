const { api } = require("./instance.js");

const addUserToPulls = async (body) => {
  try {
    const response = await api.put("/pulls/user", body);
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { addUserToPulls };

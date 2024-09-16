const { api } = require("./instance");

const getAllUsers = async () => {
  try {
    const { data } = api.get("users");
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getAllUsers };

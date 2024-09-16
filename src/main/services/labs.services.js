const { api } = require("./instance.js");

const createLabsAndPulls = async (body) => {
  try {
    const response = api.post("labs/pulls", body);
    return response;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createLabsAndPulls };

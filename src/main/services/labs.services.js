const { api } = require("./instance.js");

const createLabsAndPulls = async (body) => {
  try {
    const response = api.post("labs/pulls", body);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const getLabAndPulls = async (labName) => {
  try {
    const { data } = api.get("labs/pulls", {
      params: {
        labName: labName,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { createLabsAndPulls, getLabAndPulls };

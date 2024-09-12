const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { checkConnection, syncModels } = require("./db/index");
const addRelationsToModels = require("./db/relations");
const port = 3000;

const checkAndSync = async () => {
  await checkConnection();
  addRelationsToModels();
  await syncModels();
};

const initializeAndListen = async () => {
  try {
    const app = express()
      .use(cors())
      .use(morgan("dev"))
      .use(express.json())
      .use("/api", require("./api/router"));
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

const startAPI = async () => {
  await checkAndSync({ force: true });
  await initializeAndListen();
};

startAPI();

const { Sequelize } = require("sequelize");

const connection = new Sequelize("labTracker", "alma", "reboot", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  logging: false,
});

const checkConnection = async () => {
  try {
    await connection.authenticate();
    console.log("Connected!");
  } catch (error) {
    console.error(error);
  }
};

const syncModels = async () => {
  try {
    await connection.sync();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connection, checkConnection, syncModels };

require("dotenv").config();
const fs = require("fs").promises;
const path = "./storage.json";

const getItemFromStorageJSON = async () => {
  try {
    const data = await fs.readFile(path, "utf8");
    if (data) {
      const storage = JSON.parse(data);
      return storage || null;
    }
  } catch (error) {
    console.error(error);
  }
};

const setItemInStorageJSON = async (key, value) => {
  let storage = {};
  try {
    const data = await fs.readFile(path, "utf8");
    if (data) {
      storage = JSON.parse(data);
    }
  } catch (error) {
    console.error(error);
  }

  storage[key] = value;
  await fs.writeFile(path, JSON.stringify(storage));
};

module.exports = { getItemFromStorageJSON, setItemInStorageJSON };

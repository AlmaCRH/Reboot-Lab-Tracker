const fs = require("fs").promises;
const path = "./storage.json";
const filterPullsByUsers = require("./github");
const obj = {};

const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

rl.question("What do you want? ", (answer) => {
  rl.question("what team", async (team) => {
    obj[answer] = team;
    rl.close();
    await filterPullsByUsers();
  });
});

const getItem = async (key) => {
  try {
    const data = await fs.readFile(path, "utf8");
    const storage = JSON.parse(data);
    return storage[key] || null;
  } catch (error) {
    console.error(error);
  }
};

const setItem = async (key, value) => {
  let storage = {};
  try {
    const data = await fs.readFile(path, "utf8");
    storage = JSON.parse(data);
  } catch (error) {
    console.error(error);
  }

  storage[key] = value;
  await fs.writeFile(path, JSON.stringify(storage));
};

module.exports = { getItem, setItem, obj };

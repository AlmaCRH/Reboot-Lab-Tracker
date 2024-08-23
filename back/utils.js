require("dotenv").config();
const fs = require("fs").promises;
const path = "./storage.json";
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const rl = readline.createInterface({ input, output });
const githubData = {};

rl.question("which team? ", (team) => {
  const { loadScript } = require("./index.js");
  githubData["team"] = team;
  rl.question("which block do you want to see?", (block) => {
    githubData["block"] = block.toUpperCase();
    rl.question("which lab? ", async (lab) => {
      githubData["lab"] = lab;
      rl.close();
      loadScript();
    });
  });
});

const getItem = async () => {
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

const setItem = async (key, value) => {
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

module.exports = { getItem, setItem, githubData };

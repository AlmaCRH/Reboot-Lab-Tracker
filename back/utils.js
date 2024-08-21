const fs = require("fs").promises;
const path = "./storage.json";
const githubData = {};

const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");

const rl = readline.createInterface({ input, output });

rl.question("which team? ", (team) => {
  const { filterPullsByUsers } = require("./github.js");
  githubData["team"] = team;
  rl.question("which lab? ", async (lab) => {
    githubData["lab"] = lab;
    rl.close();
    await filterPullsByUsers();
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
    if(data){
      storage = JSON.parse(data);
    }
  } catch (error) {
    console.error(error);
  }

  storage[key] = value;
  await fs.writeFile(path, JSON.stringify(storage));
};

module.exports = { getItem, setItem, githubData };

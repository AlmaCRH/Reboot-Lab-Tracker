require("dotenv").config();
const { loadScript } = require("./index");
const { formatDate } = require("./utils");
const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const pullData = {};
const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000;

app.use(bodyParser.json());
app.post("/webhook", async (req, res) => {
  const payload = req.body;
  if (payload.action === "opened") {
    pullData["repository"] = payload.repository.name;
    pullData["user"] = payload.pull_request.user.login;
    pullData["created_at"] = formatDate(payload.pull_request.created_at);
    loadScript();
  }

  res.status(200).send("Event received");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});

module.exports = { pullData };

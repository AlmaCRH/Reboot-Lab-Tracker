const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.post("/webhook", (req, res) => {
  const payload = req.body;
  if (payload.action === "opened") {
    console.log({
      repository: payload.repository.name,
      user: payload.pull_request.user.login,
    });
  }
  //io.emit('github_event', payload)

  res.status(200).send("Event received");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

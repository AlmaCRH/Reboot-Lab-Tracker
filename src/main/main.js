require("dotenv").config();
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { loadScript, listFiles, writeIntersection } = require("./api/index");
const { getAllLabs } = require("./api/github");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: "../assets/LogoSignature.png",
  });
  win.loadFile(path.join(__dirname, "../../dist", "index.html"));

  const contents = win.webContents;
  contents.openDevTools();
};

app.whenReady().then(async () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length == 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("sendDataToFront", async (event) => {
  const contents = event.sender;
  const bootcamps = await loadScript(listFiles);
  const labs = await getAllLabs();
  contents.send("drive", bootcamps);
  contents.send("github", labs);
});

ipcMain.on("frontChannel", async (event, frontData) => {
  await loadScript(writeIntersection, frontData);
});

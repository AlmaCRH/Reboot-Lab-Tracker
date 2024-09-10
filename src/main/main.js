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
    icon: "../assets/Logo_signature.png",
  });
  win.loadFile(path.join(__dirname, "../../dist", "index.html"));

  const contents = win.webContents;
  contents.openDevTools();
  contents.on("did-finish-load", async () => {
    const bootcamps = await loadScript(listFiles);
    const labs = await getAllLabs();
    contents.send("drive", bootcamps);
    contents.send("github", labs);
  });
};

app.whenReady().then(() => {
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

ipcMain.on("data", async (event, arg1, arg2) => {
  const dataForGoogleAndGithubAPI = { bootcampId: arg1, labName: arg2 };
  await loadScript(writeIntersection, dataForGoogleAndGithubAPI);
});

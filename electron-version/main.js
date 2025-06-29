const {app, BrowserWindow} = require('electron');
const path = require("path");

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: false
        }
    });
    win.loadFile("src/game.html");
}

app.whenReady().then(createWindow);
win.webContents.openDevTools();
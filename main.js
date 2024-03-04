const { app, BrowserWindow, Menu, ipcMain } = require('electron'); // destructuring
const myMenu = require('./menu');


app.on('ready', () => {
    console.log("Application is ready");

    // open up a renderer and turn IPC on
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 605,
        resizable: false,
        webPreferences: {
            nodeIntegration: true, // default false
            contextIsolation: false // default true
        }
    });
    // mainWindow.loadURL("https://nscc.ca");
    mainWindow.loadFile('index.html');
});

Menu.setApplicationMenu(myMenu);



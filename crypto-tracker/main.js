const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    title: "Ashley's CryptoVault",
    icon: path.join(__dirname, 'build/icon.ico'),
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
  });

  const isDev = true;
  const startUrl = 'http://localhost:5173';

  win.loadURL(startUrl);

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log(`Failed to load: ${errorDescription} (${errorCode})`);
  });

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
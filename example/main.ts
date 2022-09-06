import url from 'url';
import path from 'path';
import WindowManager from 'electron-windows';
import { app, ipcMain, BrowserWindow } from 'electron';

const mainUrl = url.format({
  pathname: path.join(__dirname, 'renderer', 'index.html'),
  protocol: 'file:',
});

ipcMain.on('window-action', ({ sender }, { action }) => {
  const win = BrowserWindow.fromId(sender.id);
  switch (action) {
    case 'minimize':
      win?.minimize();
      break;
    case 'maximize':
      win?.maximize();
      break;
    case 'unmaximize':
      win?.unmaximize();
      break;
    case 'close':
      win?.close();
      break;
  }
});

app.on('ready', async () => {
  const windowManager = new WindowManager();
  const win = windowManager.create({
    name: 'main',
    browserWindow: {
      titleBarStyle: 'hidden',
      width: 1280,
      height: 800,
      title: 'electrom',
      show: false,
      acceptFirstMouse: true,
      webPreferences: {
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    },
  });

  win.loadURL(mainUrl);
  win.webContents.openDevTools({ mode: 'detach' });
  win.once('ready-to-show', () => {
    win.show();
  });
});

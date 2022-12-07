import url from 'url';
import path from 'path';
import WindowManager from 'electron-windows';
import { app, ipcMain, BrowserWindow } from 'electron';
import { waitPort } from 'detect-port';
import winTitlebar from '..';

const mainUrl = url.format({
  pathname: path.join(__dirname, 'renderer', 'index.html'),
  protocol: 'file:',
});

const addonDemoUrl = url.format({
  pathname: path.join(__dirname, 'renderer', 'addon-demo', 'index.html'),
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

ipcMain.handle('get-window-hwnd', ({ sender }) => {
  const win = BrowserWindow.fromId(sender.id);
  const hwnd = win?.getNativeWindowHandle();
  return hwnd;
});

ipcMain.on('switch-to-dark', ({ sender }) => {
  const win = BrowserWindow.fromId(sender.id);
  const hwnd = win?.getNativeWindowHandle();
  if (hwnd) {
    winTitlebar.switchToDark(hwnd);
  }
});

ipcMain.on('switch-to-light', ({ sender }) => {
  const win = BrowserWindow.fromId(sender.id);
  const hwnd = win?.getNativeWindowHandle();
  if (hwnd) {
    winTitlebar.switchToLight(hwnd);
  }
});

app.on('ready', async () => {
  await waitPort(8080);

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

  // win.loadURL(mainUrl);
  // win.webContents.openDevTools({ mode: 'detach' });
  // win.once('ready-to-show', () => {
  //   win.show();
  // });

  const addonWin = windowManager.create({
    name: 'addon',
    browserWindow: {
      width: 1280,
      height: 800,
      title: 'addon demo',
      webPreferences: {
        preload: path.join(__dirname, 'renderer', 'preload.js'),
      },
    },
  });

  addonWin.loadURL(addonDemoUrl);
  addonWin.webContents.openDevTools({ mode: 'detach' });
  addonWin.once('ready-to-show', () => {
    addonWin.show();
  });
});

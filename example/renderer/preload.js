'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  },
});

window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.invoke('get-window-hwnd').then(res => {
    const element = document.getElementById('electron-window');
    if (element) element.innerText = res;
  });

  document.getElementById('switch-dark-mode').addEventListener('click', () => {
    ipcRenderer.send('switch-dark-mode');
  });

  document.getElementById('switch-light-mode').addEventListener('click', () => {
    ipcRenderer.send('switch-light-mode');
  });
});

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

  const btn = document.getElementById('change-theme');
  if (btn) {
    btn.addEventListener('click', () => {
      ipcRenderer.send('change-dark-theme');
    });
  }
});

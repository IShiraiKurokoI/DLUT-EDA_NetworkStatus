const { contextBridge,ipcRenderer,clipboard } = require('electron')
const path = require("path");

window.openWindow=function (message){
  ipcRenderer.send("openWindow",message)
}

window.openLoginWindow=function (message){
  ipcRenderer.send("openLoginWindow",message)
}

window.clipboard=clipboard

contextBridge.exposeInMainWorld(
    'electronApi', {
        openWindow: window.openWindow,
        openLoginWindow: window.openLoginWindow,
        clipboard : window.clipboard,
        path : path,
        __dirname : __dirname
    },
);
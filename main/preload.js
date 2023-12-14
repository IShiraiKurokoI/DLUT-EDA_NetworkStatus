const { contextBridge,ipcRenderer } = require('electron')

window.openWindow=function (message){
  ipcRenderer.send("openWindow",message)
}

window.openLoginWindow=function (message){
  ipcRenderer.send("openLoginWindow",message)
}

contextBridge.exposeInMainWorld(
    'electronApi', {
        openWindow: window.openWindow,
        openLoginWindow: window.openLoginWindow
    }
);
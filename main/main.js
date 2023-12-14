const { app, BrowserWindow, Menu, clipboard, Notification, ipcMain} = require('electron')
const path = require('path')

if (process.platform === 'win32') {
  app.setAppUserModelId("DLUT-EDA-NetworkStatus");
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: true
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'EDA.html'))

  // 创建一个自定义菜单
  const template = [
    {
      label: '刷新',
      role: 'reload' // 刷新页面
    },
    {
      label: '放大',
      role: 'zoomIn' // 放大
    },
    {
      label: '缩小',
      role: 'zoomOut' // 缩小
    },
    {
      label: '重置缩放',
      role: 'resetZoom' // 重置缩放
    },
    {
      label: '强制刷新',
      role: 'forceReload' // 强制刷新页面
    },
    {
      label: '开发者工具',
      click: () => {
        mainWindow.webContents.openDevTools({ mode: 'detach' }); // 使用detach模式
      }
    }
  ]


  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // 其他窗口逻辑
}

function createWindowForUrl(url) {
  const childWinb = new BrowserWindow({
    width: 1360,
    height: 720,
    icon: path.join(__dirname, 'icon.ico'),
    thickFrame: true,
    webPreferences: {
      partition:"common"
    }
  });
  // 加载页面
  console.log(`[Browser Page]Load page:${url}`);
  childWinb.webContents.setWindowOpenHandler(({url}) => {
    creteWindowForUrl(url)
    return {action: 'deny'}
  })
  childWinb.loadURL(url);
  // 创建菜单
  const template = [
    {
      label: '前进',
      click: () => {
        if (childWinb.webContents.canGoForward()) {
          childWinb.webContents.goForward();
        }
      }
    },
    {
      label: '后退',
      click: () => {
        if (childWinb.webContents.canGoBack()) {
          childWinb.webContents.goBack();
        }
      }
    },
    {
      label: '刷新',
      click: () => {
        childWinb.webContents.reload();
      }
    },
    {
      label: '复制当前链接',
      click: () => {
        const currentURL = childWinb.webContents.getURL();
        clipboard.writeText(currentURL);
        new Notification({
          title: "复制成功！",
          icon: path.join(__dirname, 'icon.ico'),
          body: "链接已经成功复制到剪贴板。"
        }).show()
      }
    },
    {
      label: '开发者工具',
      click: () => {
        childWinb.webContents.openDevTools();
      }
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  childWinb.setMenu(menu)
}

function createInprivateWindowForUrl(url) {
  const childWinb = new BrowserWindow({
    width: 1360,
    height: 720,
    icon: path.join(__dirname, 'icon.ico'),
    thickFrame: true,
    webPreferences: {
      partition:`incognito-${Date.now()}`
    }
  });
  // 加载页面
  console.log(`[Browser Page]Load page:${url}`);
  childWinb.webContents.setWindowOpenHandler(({url}) => {
    creteWindowForUrl(url)
    return {action: 'deny'}
  })
  childWinb.loadURL(url);
  // 创建菜单
  const template = [
    {
      label: '前进',
      click: () => {
        if (childWinb.webContents.canGoForward()) {
          childWinb.webContents.goForward();
        }
      }
    },
    {
      label: '后退',
      click: () => {
        if (childWinb.webContents.canGoBack()) {
          childWinb.webContents.goBack();
        }
      }
    },
    {
      label: '刷新',
      click: () => {
        childWinb.webContents.reload();
      }
    },
    {
      label: '复制当前链接',
      click: () => {
        const currentURL = childWinb.webContents.getURL();
        clipboard.writeText(currentURL);
        new Notification({
          title: "复制成功！",
          icon: path.join(__dirname, 'icon.ico'),
          body: "链接已经成功复制到剪贴板。"
        }).show()
      }
    },
    {
      label: '开发者工具',
      click: () => {
        childWinb.webContents.openDevTools();
      }
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  childWinb.setMenu(menu)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('openWindow', (event, arg) => {
    createWindowForUrl(arg)
  });

  ipcMain.on('openLoginWindow', (event, arg) => {
    createInprivateWindowForUrl(arg)
  });
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

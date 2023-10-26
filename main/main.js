const { app, BrowserWindow, Menu} = require('electron')
const path = require('path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const { handleGetAudioFilesPath } = require('./ipchandler/render.event.handler')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('build/index.html')
  win.addListener
  //win.webContents.openDevTools()
}

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})
app.whenReady().then(() => {
  ipcMain.handle('file:getAudioFilesPath', handleGetAudioFilesPath)
  createWindow()
})
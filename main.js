const { app, BrowserWindow, ipcMain } = require('electron')
const { enableDrag } = require('electron-drag');
const path = require('node:path')
const { handleGetAudioFilesPath, handleGetFileMetaData } = require('./ipchandler/render.event.handler')
const { handleCreateAlbum } = require('./ipchandler/createAlbum')
const { handleGetAllPlayList } = require('./ipchandler/getPlayList')

let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false
  })

  win.loadFile('build/index.html')
  win.addListener
 // enableDrag(win);
  //win.webContents.openDevTools()
}

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})
app.whenReady().then(async () => {
  ipcMain.handle('file:getAllPlayList', handleGetAllPlayList)
  ipcMain.handle('file:getAudioFilesPath', handleGetAudioFilesPath)
  ipcMain.handle('file:createAlbum', handleCreateAlbum)
  ipcMain.handle('file:getFileMetaData', handleGetFileMetaData)

  ipcMain.handle('close', () => {
    console.log("close")
    if (win) win.close();
  })
  ipcMain.handle('minimize', () => {
    if (win) win.minimize();
  })
  ipcMain.handle('maximize', () => {
    if (win) {
      win.isMaximized() ? win.unmaximize() : win.maximize();
    }
  })
  createWindow()
})
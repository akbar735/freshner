const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getAllPlayList: () => ipcRenderer.invoke('file:getAllPlayList'),
  getAudioFilesPath: (albumPath) => ipcRenderer.invoke('file:getAudioFilesPath', albumPath),
  getFileMetaData: (url) => ipcRenderer.invoke('file:getFileMetaData', url),
  handleCreateAlbum: (albumName, formattedFiles) => ipcRenderer.invoke('file:createAlbum', albumName, formattedFiles),
  closeWindow: () => ipcRenderer.invoke('close'),
  minimizeWindow: () => ipcRenderer.invoke('minimize'),
  maximizeWindow: () => ipcRenderer.invoke('maximize')
})
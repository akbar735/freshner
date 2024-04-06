const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getAllPlayList: () => ipcRenderer.invoke('file:getAllPlayList'),
  getFiles: (foldersArr, fileType) => ipcRenderer.invoke('file:getFiles', foldersArr, fileType),
  getFileMetaData: (url) => ipcRenderer.invoke('file:getFileMetaData', url),
  getFolderPath: () => ipcRenderer.invoke('folder:getFolderPath'),
  handleCreateAlbum: (albumName, formattedFiles) => ipcRenderer.invoke('file:createAlbum', albumName, formattedFiles),
  closeWindow: () => ipcRenderer.invoke('close'),
  minimizeWindow: () => ipcRenderer.invoke('minimize'),
  maximizeWindow: () => ipcRenderer.invoke('maximize')
})
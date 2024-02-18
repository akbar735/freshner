const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getAudioFilesPath: () => ipcRenderer.invoke('file:getAudioFilesPath'),
  handleCreateAlbum: (albumName, formattedFiles) => ipcRenderer.invoke('file:createAlbum', albumName, formattedFiles)
})
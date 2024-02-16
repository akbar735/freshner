const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getAudioFilesPath: () => ipcRenderer.invoke('file:getAudioFilesPath')
})
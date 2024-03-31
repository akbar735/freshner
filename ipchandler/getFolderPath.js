const { dialog } = require('electron');
const hadleGetFolderPath = async (window) => {
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedFolder = result.filePaths[0];
      return selectedFolder
      // Do something with the selected folder
    }
};

module.exports = {
  hadleGetFolderPath
}
const path = require('node:path')
const fs = require('fs')


const handleGetAllPlayList =  async () => {
    const audioContainerPath = path.join(__dirname,'..','data', 'play-list');

    const audioFiles = await fs.promises.readdir(audioContainerPath);
    const playLists = []
    for(const index in audioFiles){
        const fullPath = `${audioContainerPath}/${audioFiles[index]}`;
        const stats = await fs.promises.stat(fullPath);
        if(stats.isDirectory()){
            playLists.push({
                path: fullPath,
                name: audioFiles[index]
            })
           
        }
    }
    return playLists
}

module.exports = {
    handleGetAllPlayList
}
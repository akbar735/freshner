const path = require('node:path')
const fs = require('fs')
const audioContainerPath = path.join(__dirname,'..','src', 'data')

const handleGetAudioFilesPath = async () => {

    const audioFiles = await fs.promises.readdir(audioContainerPath)
    return audioFiles.map(fileName => {
        return {
            name: fileName,
            src: `${audioContainerPath.replace(/\\/g, '/')}/${fileName}`
        } 
    })
}

module.exports ={
    handleGetAudioFilesPath
}
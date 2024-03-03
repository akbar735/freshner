const path = require('node:path')
const fs = require('fs')
var jsmediatags = require("jsmediatags");


const getMetaData = (url) => {
    return new Promise((resolve, reject) => {
        jsmediatags.read(url, {
            onSuccess: function(tag) {
                resolve(tag);
            },
            onError: function(error) {
                reject(error)
            }
          });
    })
}
const handleGetAudioFilesPath = async (_event, albumPath) => {
    const audioFiles = await fs.promises.readdir(albumPath)
    const audioFilesWithMetaData = []
    for(let i=0; i< audioFiles.length; i++){
        const metadata = await getMetaData(`${albumPath.replace(/\\/g, '/')}/${audioFiles[i]}`)

        console.log('metadata::', metadata)
        let base64String = ''
        if (metadata?.tags?.picture?.data) {
            const dataArray = metadata.tags.picture.data;
            let charArray = [];
            for (let i = 0; i < dataArray.length; i++) {
              charArray.push(String.fromCharCode(dataArray[i]));
            }
            base64String = btoa(charArray.join(''));
          }

        audioFilesWithMetaData.push({
            name: audioFiles[i],
            src: `${albumPath.replace(/\\/g, '/')}/${audioFiles[i]}`,
            metadata:  {
                album: metadata?.tags?.album,
                picture: {
                    format: metadata?.tags?.picture?.format,
                    description: metadata?.tags?.picture?.description,
                    type: metadata?.tags?.picture?.type,
                    base64Image: `data:${metadata?.tags?.picture?.format};base64,${base64String}`
                },
                artist: metadata?.tags?.artist,
                title: metadata?.tags?.title
            }
        })
    }
    return audioFilesWithMetaData
}

module.exports ={
    handleGetAudioFilesPath
}
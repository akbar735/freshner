export function getFileType (mime: string){
    return mime.split('/')[0]
}
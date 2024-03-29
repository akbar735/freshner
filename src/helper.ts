import { IFileDetail, IFileType } from "./types"

export function getFileType (mime: string){
    return mime.split('/')[0]
}

export function getSerializableFileDetail(file: File & {path?: string, lastModifiedDate?: string}){
    return {
        lastModified: file.lastModified ,
        lastModifiedDate: file.lastModifiedDate?.toString() ,
        name: file.name ,
        path: file.path ,
        size: file.size ,
        type: file.type ,
        webkitRelativePath: file.webkitRelativePath ,
    }
}

export function isFileLocatioSame(file1: IFileType, file2: IFileType){
    return file1.path === file2.path
}

export function getLoadedFile(file: File & {path?: string}, files: IFileDetail[]){
    const loadedFile = files.find(el => el.file.path === file.path)
    return loadedFile
}
export function getOptimizedEndpoint(rormattedTime: string){
    let [hr, min, sec] = rormattedTime.split(':').map(str => str.trim())
    hr = hr+':'
    min = min+':'
    return hr+min+sec
}
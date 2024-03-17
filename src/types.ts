export interface IMetaData{
    album: string;
    picture: {
        format: string;
        description: string;
        type: string;
        base64Image: string;
    },
    artist: string;
    title: string;
}
export interface IFileType {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    path: string;
    size: string;
    type: string;
    webkitRelativePath: string;
}

export interface IFileDetail{
    file: IFileType;
    id: string;
}


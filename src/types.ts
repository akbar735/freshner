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
    webkitRelativePath?: string;
}

export interface IFileDetail{
    file: IFileType;
    id: string;
}

export enum MediaLocation{
    HOME='home',
    AUDIOGALLERY='audioGallery',
    VIDEOGALLERY='videoGallery',
    PLAYLIST='playList'
}

export enum PathKey{
    AUDIOPATH = 'audioPath',
    VIDEOPATH = 'videoPath'
}

export enum MediaMime{
    AUDIO_MIME = 'audio/*',
    VIDEO_MIME = 'video/*',
}

export enum MediaType{
    AUDIO = 'audio',
    VIDEO = 'video',
}
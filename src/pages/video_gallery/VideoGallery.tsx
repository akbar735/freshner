import React from "react";
import MediaGallery from "../../components/audio/components/MediaGallery/MediaGallery";
import { PathKey, MediaMime, MediaLocation, MediaType } from "../../types";

VideoGallery.displayName = 'VideoGallery';
export default function VideoGallery(){
    
    return <MediaGallery 
            pathKey={PathKey.VIDEOPATH} 
            mediaMime={MediaMime.VIDEO_MIME} 
            mediaLocation={MediaLocation.VIDEOGALLERY} 
            mediaType={MediaType.VIDEO}
    />
}
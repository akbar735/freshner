import React from "react";
import MediaGallery from "../../components/audio/components/MediaGallery/MediaGallery";
import { PathKey, MediaMime, MediaLocation, MediaType } from "../../types";

AudioGallery.displayName = 'AudioGallery';
export default function AudioGallery(){
    
    return <MediaGallery 
            pathKey={PathKey.AUDIOPATH} 
            mediaMime={MediaMime.AUDIO_MIME} 
            mediaLocation={MediaLocation.AUDIOGALLERY} 
            mediaType={MediaType.AUDIO}
    />
}
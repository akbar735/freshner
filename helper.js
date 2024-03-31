const fs = require('fs');

function isAudioOrVideo(filePath) {
    const buffer = Buffer.alloc(8); // Allocate buffer to read initial bytes (up to 8 bytes)
    const fileDescriptor = fs.openSync(filePath, 'r'); // Open file for reading

    try {
        fs.readSync(fileDescriptor, buffer, 0, 8, 0); // Read first 8 bytes of the file
        fs.closeSync(fileDescriptor); // Close file descriptor after reading

        // Check for common signatures of audio and video formats
        if (isAudio(buffer)) {
            return 'audio';
        } else if (isVideo(buffer)) {
            return 'video';
        } else {
            return 'unknown'; // Neither audio nor video
        }
    } catch (error) {
        console.error('Error reading file:', error);
        return 'unknown'; // Error occurred, type is unknown
    }
}

function isAudio(buffer) {
    // Check for common audio file signatures
    // Example: MP3 (49 44 33), WAV (52 49 46 46)
    return (
        (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) || // MP3
        (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) // WAV
        // Add more audio file checks here as needed
    );
}

function isVideo(buffer) {
    // Check for common video file signatures
    // Example: MP4 (00 00 00 18 66 74 79 70 6D 70 34 32)
    return (
        (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) // MP4
        // Add more video file checks here as needed
    );
}

module.exports = {
    isAudioOrVideo
}

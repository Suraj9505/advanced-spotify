import { useState } from 'react';

export const useAudioDuration = () => {
    const [duration, setDuration] = useState<number | null>(null);

    const calculateDuration = (audioFile: File) => {
        const audio = new Audio(URL.createObjectURL(audioFile));
        audio.addEventListener('loadedmetadata', () => {
            setDuration(Math.floor(audio.duration)); // Calculate duration in seconds
        });
    };

    return { duration, calculateDuration };
};

import { useRef, useEffect } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying, playNext} = usePlayerStore();

    // handle play/pause music
    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play();
        }
        else {
            audioRef.current?.pause();
        }
    }, [isPlaying]);

    // handles end of song
    useEffect(() => {
		const audio = audioRef.current;

        const handleEnded = () => {
			playNext();
		};

		audio?.addEventListener("ended", handleEnded);

		return () => audio?.removeEventListener("ended", handleEnded);
	}, [playNext]);

    // handle song controls
    useEffect(() => {
        if(!audioRef.current || !currentSong) return
        const audio = audioRef.current;

        //check if this is actually new song
        const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
        if(isSongChange){
            audio.src = currentSong?.audioUrl;
            audio.currentTime = 0;
            prevSongRef.current = currentSong?.audioUrl

            if(isPlaying) audio.play();
        }
    }, [currentSong, isPlaying])

    return (
        <audio ref={audioRef} />
    )
}

export default AudioPlayer

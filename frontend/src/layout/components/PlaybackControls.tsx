import { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Button } from "@/components/ui/button";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

const formatTime = (seconds: number) => {
    const minuts = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minuts}:${remainingSeconds.toString().padStart(2, '0')}`
}

const PlaybackControls = () => {
  const { currentSong, playNext, playPrevious, togglePlay, isPlaying } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");

    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };
    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  const toggleVolume = () => {
    if (audioRef.current) {
      const newVolume = audioRef.current.volume > 0 ? 0 : 0.5;
      audioRef.current.volume = newVolume;
      setVolume(newVolume * 100);
    }
  };

  return (
    <footer className="h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4">
      <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
        {/* currently playing song */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[36%]">
          {currentSong && (
            <>
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="size-14 object-cover rounded-mf"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate hover:underline cursor-pointer">
                  {currentSong.title}
                </div>
                <div className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                  {currentSong.artist}
                </div>
              </div>
            </>
          )}
        </div>

        {/* player controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w[45%]">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* shuffle button */}
            <Button
              size={"icon"}
              variant={"ghost"}
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
            >
              <Shuffle className="size-4" />
            </Button>

            {/* previous button */}
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:text-white text-zinc-400"
              onClick={playPrevious}
              disabled={!currentSong}
            >
              <SkipBack />
            </Button>

            {/* play/pause button */}
            <Button
              size={"icon"}
              onClick={togglePlay}
              disabled={!currentSong}
              className="bg-white hover:bg-white/80 text-black rounded-full size-10"
            >
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>

            {/* next button */}
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:text-white text-zinc-400"
              onClick={playNext}
              disabled={!currentSong}
            >
              <SkipForward />
            </Button>

            {/* repeat button */}
            <Button
              className="hidden sm:inline-flex hover:text-white text-zinc-400"
              size={"icon"}
              variant={"ghost"}
            >
              <Repeat />
            </Button>
          </div>

          {/* playback slider */}
          <div className="hidden sm:flex items-center gap-2 w-full">
            <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={1}
              className="w-full hover:cursor-grab active:cursor-grabbing"
            />
            <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
          </div>
        </div>

        {/* volume controls */}
        <div className="hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end">
          <Button variant={"ghost"} size={"icon"} className="hover:text-white text-zinc-400">
            <Mic2 />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="hover:text-white text-zinc-400">
            <ListMusic />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="hover:text-white text-zinc-400">
            <Laptop2 />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="hover:text-white text-zinc-400"
              onClick={toggleVolume}
            >
              {volume ? <Volume1 className="size-5" /> : <VolumeX className="size-5" />}
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              className="w-24 hover:cursor-grab active:cursor-grabbing"
              onValueChange={(value) => {
                setVolume(value[0]);
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlaybackControls;

import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?._id === song._id;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else setCurrentSong(song);
  };

  return (
    <Button
      size="icon"
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${
        isCurrentSong
          ? "opacity-100 bg-transparent hover:bg-transparent"
          : "opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-400"
      }`}
    >
      {isCurrentSong ? (
        <img
          src="/music_disc.webp"
          alt="music-disc"
          className={`${isPlaying ? "animate-spin" : "hover:scale-105" }`}
        />
      ) : (
        <Play />
      )}
    </Button>
  );
};

export default PlayButton;

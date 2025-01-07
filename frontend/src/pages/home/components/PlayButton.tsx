import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Play } from "lucide-react";

const PlayButton = ({ song }: { song: Song }) => {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
    const isCurrentSong = currentSong?._id === song._id;
    const { favorites, addToFavorites, removeFromFavorites } = useMusicStore();

    let isFavourite = false;
    if(favorites.length > 0) {
     isFavourite = favorites.find(fav => fav._id === song._id) ? true : false;
    }


    const handlePlay = () => {
        if (isCurrentSong) togglePlay();
        else setCurrentSong(song);
    };

    return (
        <div className="flex justify-between items-center">
            {isFavourite ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" stroke="currentColor" onClick={() => removeFromFavorites(song)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-10 absolute bottom-4 left-3 sm:left-5 md:left-5 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" onClick={() => addToFavorites(song)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-10 absolute bottom-4 left-3 sm:left-5 md:left-5 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
            }

            <Button
                size="icon"
                onClick={handlePlay}
                className={`absolute bottom-3 right-2 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${isCurrentSong
                        ? "opacity-100 bg-transparent hover:bg-transparent"
                        : "opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-400"
                    }`}
            >
                {isCurrentSong ? (
                    <img
                        src="/music_disc.webp"
                        alt="music-disc"
                        className={`${isPlaying ? "animate-spin" : "hover:scale-105"}`}
                    />
                ) : (
                    <>
                        <Play />
                    </>
                )}
            </Button>
        </div>
    );
};

export default PlayButton;

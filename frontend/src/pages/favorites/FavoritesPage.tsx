import { useMusicStore } from "@/stores/useMusicStore"
import PlayButton from "../home/components/PlayButton";
import { useEffect } from "react";

const FavoritesPage = () => {

    const { favorites, fetchFavorites } = useMusicStore();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites])
    return (
        <>
        {favorites.length > 0 ?
        (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((song) => (
                <div key={song._id} className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer">
                    <div className="relative mb-4">
                        <div className="aspect-square rounded-md shadow-lg overflow-hidden">
                            <img src={song.imageUrl} alt={song.title} className="size-full object-cover transition transform duration-300 group-hover:scale-110" />
                        </div>
                        <PlayButton song={song} />
                    </div>
                    <h3 className="font-medium mb-2 truncate">{song.title}</h3>
                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                </div>
            ))}
        </div>
        )
        :
        <span className="text-zinc-400 text-2xl h-full flex items-center justify-center">
            You have no favorites songs
        </span>
        }
        </>
    )
}

export default FavoritesPage

import { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore"
import { Calendar, Loader, Trash2 } from "lucide-react";

const SongsTable = () => {

    const { songs, isAllSongsLoading, error, deleteSong, fetchStats } = useMusicStore();

    // useEffect(() => {
    //     fetchStats();
    // }, [songs])

    if (isAllSongsLoading ) {
        return (
            <div className="size-full flex items-center justify-center">
                <Loader className="text-emerald-500 animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="size-full items-center justify-center">
                <p className="text-zinc-500 text-lg mb-4 flex justify-center items-center mt-auto">{error}</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-zinc-800/50">
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Artitst</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
                <TableBody>
                    {songs.map((song) => (
                            <TableRow key={song._id} className="hover:bg-zinc-800/50">
                                <TableCell>
                                    <img src={song.imageUrl} alt={song.title} className="size-10 rounded object-cover"/>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {song.title}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {song.artist}
                                </TableCell>
                                <TableCell className="font-mediums">
                                    <span className="inline-flex items-center gap-1 text-zinc-400">
                                        <Calendar className="size-4"/>
                                        {song.createdAt.split("T")[0]}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant={"ghost"} size={"sm"} className="text-red-600 hover:text-red-500 hover:bg-red-600/10" onClick={() => {deleteSong(song._id)}}>
                                    <Trash2 className="size-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>

                    ))}
                </TableBody>
        </Table>
    )
}

export default SongsTable

import { useRef, useState } from 'react';
import { useMusicStore } from "@/stores/useMusicStore";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { useAudioDuration } from '@/hooks/useAudioDuration'; // Import the custom hook

interface NewSong {
    title: string,
    artist: string,
    album: string,
    duration: string,
}

const AddSongDialog = () => {
    const { albums, addSong } = useMusicStore();
    const [songDialogOpen, setSongDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newSong, setNewSong] = useState<NewSong>({
        title: "",
        artist: "",
        album: "",
        duration: "0",
    });

    const [files, setFiles] = useState<{ audio: File | null, image: File | null }>({
        audio: null,
        image: null,
    });

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const { duration, calculateDuration } = useAudioDuration(); // Use the custom hook

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            if (!files.audio) {
                return toast.error("Please upload audio file");
            }

            const formData = new FormData();

            formData.append("title", newSong.title);
            formData.append("artist", newSong.artist);
            formData.append("duration", String(duration || 0)); // Use the calculated duration
            if (newSong.album && newSong.album !== "none") {
                formData.append("albumId", newSong.album);
            }

            formData.append("audioFile", files.audio);
            if(files.image) {
                formData.append("imageFile", files.image);
            }
            else{
                formData.append("imageFile", "");
            }

            await addSong(formData);

            setNewSong({
                title: "",
                artist: "",
                album: "",
                duration: "0",
            });

            setFiles({
                audio: null,
                image: null,
            });
        } catch (error: any) {
            toast.error("Failed to add song: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={songDialogOpen} onOpenChange={setSongDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-emerald-600 hover:bg-emerald-600/50 text-white'>
                    <Plus className='mr-1 size-4' />
                    Add Song
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto'>
                <DialogHeader>
                    <DialogTitle>Add New Song</DialogTitle>
                    <DialogDescription>Add a new song to your music library</DialogDescription>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    <input
                        type="file"
                        hidden
                        accept='audio/*'
                        ref={audioInputRef}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setFiles((prev) => ({ ...prev, audio: file }));
                                calculateDuration(file); // Calculate the duration when the file is uploaded
                            }
                        }}
                    />

                    <input
                        type="file"
                        hidden
                        accept='image/*'
                        ref={imageInputRef}
                        onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
                    />

                    {/* Image upload area */}
                    <div
                        className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className='text-center'>
                            {files.image ? (
                                <div className='space-y-2'>
                                    <div className='text-sm text-emerald-500'>Image selected:</div>
                                    <div className='text-xs text-zinc-400'>{files.image.name.slice(0, 20)}</div>
                                </div>
                            ) : (
                                <>
                                    <div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
                                        <Upload className='h-6 w-6 text-zinc-400' />
                                    </div>
                                    <div className='text-sm text-zinc-400 mb-2'>Upload artwork</div>
                                    <Button variant='outline' size='sm' className='text-xs'>
                                        Choose File
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Audio upload */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Audio File</label>
                        <div className='flex items-center gap-2'>
                            <Button variant='outline' onClick={() => audioInputRef.current?.click()} className='w-full'>
                                {files.audio ? files.audio.name.slice(0, 20) : "Choose Audio File"}
                            </Button>
                        </div>
                    </div>

                    {/* Duration (calculated) */}
                    <div className='space-y-2'>
                        <label htmlFor="duration" className='text-sm font-medium'>Duration (seconds)</label>
                        <Input
                            type='text'
                            value={duration ? duration.toString() : "Calculating..."}
                            readOnly
                            id="duration"
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>

                    {/* Other fields */}
                    <div className='space-y-2'>
                        <label htmlFor="title" className='text-sm font-medium'>Title</label>
                        <Input value={newSong.title} onChange={(e) => setNewSong({ ...newSong, title: e.target.value })} id="title" placeholder="Title" className='bg-zinc-800 border-zinc-700' />
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="artist" className='text-sm font-medium'>Artist</label>
                        <Input value={newSong.artist} onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })} id="artist" placeholder="Artist" className='bg-zinc-800 border-zinc-700' />
                    </div>

                    <div className='space-y-2'>
                        <label className="text-sm font-medium">Album (optional)</label>
                        <Select value={newSong.album} onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
                            <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                                <SelectValue placeholder="Select album" />
                            </SelectTrigger>
                            <SelectContent className='bg-zinc-800 border-zinc-700'>
                                <SelectItem value='none'>No Album (Single)</SelectItem>
                                {albums.map((album) => (
                                    <SelectItem key={album._id} value={album._id}>{album.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setSongDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className='text-zinc-300' disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add Song"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddSongDialog;

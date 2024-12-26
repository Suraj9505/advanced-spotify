import { useRef, useState } from 'react';
import { useMusicStore } from "@/stores/useMusicStore"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';

const AddSongDialog = () => {

    const { albums } = useMusicStore();
    const [songDialogOpen, setSongDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [newSong, setNewSong] = useState({
        title: "",
        artist: "",
        album: undefined,
        duration: 0,
    })

    const [files, setFiles] = useState<{audio: File | null, image: File | null}>({
        audio: null,
        image: null,
    })

    const audioInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {

    }

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
                    <input type="file" hidden accept='audio/*' ref={audioInputRef} onChange={(e) => setFiles(prev => ({...prev, audio: e.target.files![0]}))}/>

                    <input type="file" hidden accept='image/*' ref={imageInputRef} onChange={(e) => setFiles(prev => ({...prev, image: e.target.files![0]}))}/>

                    {/* image upload area */}
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
                </div>
             </DialogContent>
        </Dialog>
    )
}

export default AddSongDialog

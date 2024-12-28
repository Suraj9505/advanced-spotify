import { useEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, MessageCircle, Library } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { SignedIn } from '@clerk/clerk-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import AlbumSkeleton from '@/components/skeletons/AlbumSkeleton'
import { useMusicStore } from '@/stores/useMusicStore'

const LeftSidebar = () => {
    const route = useLocation();
    const { albums, isAlbumsLoading, fetchAlbums, } = useMusicStore();

    useEffect(() => {
        fetchAlbums()
    }, [fetchAlbums])


    return (
        <div className='h-full flex flex-col gap-2'>
            {/* Navigatio menu */}
            <div className='rounded-lg bg-zinc-900 p-4'>
                <div className='space-y-2'>
                    <Link to={"/"} className={cn(buttonVariants(
                        {
                            variant: "ghost",
                            className: `w-full hover:bg-zinc-800 text-white justify-center md:justify-start ${route.pathname === "/" ? "bg-emerald-600" : ""}`
                        }
                    ))}>
                        <HomeIcon className='size-5' />
                        <span className='hidden md:inline'>Home</span>
                    </Link>
                    <SignedIn>
                        <Link to={"/chat"} className={cn(buttonVariants(
                            {
                                variant: "ghost",
                                className: `w-full hover:bg-zinc-800 text-white justify-center md:justify-start ${route.pathname === "/chat" ? "bg-emerald-600" : ""}`
                            }
                        ))}>
                            <MessageCircle className=' size-5' />
                            <span className='hidden md:inline'>Messages</span>
                        </Link>
                    </SignedIn>
                </div>
            </div>

            {/* Library Section */}
            <div className="flex-1 rounded-lg bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-white px-2">
                        <Library className="size-5 mr-2" />
                        <span className='hidden md:inline'>Albums</span>
                    </div>
                </div>
                <ScrollArea className='h-[calc(100vh-300px)] '>
                    <div className='space-y-2'>
                        {isAlbumsLoading ? (
                            <AlbumSkeleton />
                        ) : (
                            albums.map((album) => (
                                <Link to={`/album/${album._id}`} key={album._id} className={`flex items-center p-2 gap-3 group cursor-pointer  rounded-md ${route.pathname === `/album/${album._id}` ? "bg-emerald-600 " : "hover:bg-emerald-600"}`}>
                                    <img src={album.imageUrl} alt={album.title} className='size-12 rounded-md flex-shrink-0 object-cover'/>
                                    <div className='flex-1 min-w-0 hidden md:block'>
                                        <p className='font-medium truncate'>{album.title}</p>
                                        <p className={`text-sm group-hover:text-zinc-50 truncate text-zinc-300`}>
                                           Album • {album.artist}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default LeftSidebar

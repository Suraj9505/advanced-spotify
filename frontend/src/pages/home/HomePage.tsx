import { useEffect } from 'react';

import { useMusicStore } from "@/stores/useMusicStore"
import Topbar from "@/components/Topbar"
import FeaturedSection from './components/FeaturedSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import SectionGrid from './components/SectionGrid';
import { usePlayerStore } from '@/stores/usePlayerStore';

const HomePage = () => {
    const {
        fetchFeaturedSongs,
        fetchMadeForYouSongs,
        fetchTrendingSongs,
        isMadeForYouLoading,
        isTrendingLoading,
        madeForYouSongs,
        featuredSongs,
        trendingSongs } = useMusicStore();

      const { initializeQueue } = usePlayerStore();

      useEffect(()=> {
        if(madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
            const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
            initializeQueue(allSongs);
        }
      }, [initializeQueue, featuredSongs, madeForYouSongs, trendingSongs])

    useEffect(() => {
        fetchFeaturedSongs();
        fetchMadeForYouSongs();
        fetchTrendingSongs();
    }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

    return (
        <main className='overflow-hidden h-full'>
			<Topbar />
            {/* Todo: change the height to 100vh  */}
			<ScrollArea className='h-[calc(100vh-180px)] bg-zinc-900 mt-2'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good afternoon</h1>
					<FeaturedSection />

					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isMadeForYouLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isTrendingLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
    )
}

export default HomePage

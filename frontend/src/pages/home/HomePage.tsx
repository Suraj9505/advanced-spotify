import { useEffect, useState } from 'react';

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

      const [greeting, setGreeting] = useState('');
      const currentHour = new Date().getHours();

      const calculateGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour >= 4 && currentHour < 12) {
            return "Good Morning";
        } else if (currentHour >= 12 && currentHour < 17) {
            return "Good Afternoon";
        } else if (currentHour >= 17 && currentHour < 22) {
            return "Good Evening";
        } else {
            return "Good Night";
        }
    };

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

    useEffect(() => {
        // Set initial greeting
        setGreeting(calculateGreeting());

        // Update greeting every minute to ensure it updates at the right time
        const interval = setInterval(() => {
            setGreeting(calculateGreeting());
        }, 60 * 1000); // Check every 60 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    return (
        <main className='overflow-hidden h-full'>
			<Topbar />
            {/* Todo: change the height to 100vh  */}
			<ScrollArea className='h-[calc(100vh-180px)] bg-zinc-900 mt-2'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>{greeting}</h1>
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

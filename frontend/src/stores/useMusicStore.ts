import { axiosInstance } from '@/lib/axios';
import { Album, Song } from '@/types';
import { create } from 'zustand'

interface MusicStore {
    albums: Album[];
    songs: Song[];
    isSongsLoading: boolean;
    isAlbumsLoading: boolean;
    isMadeForYouLoading: boolean;
    isFeaturedLoading: boolean;
    isTrendingLoading: boolean;
    error: string | null;
    currentAlbum: Album | null,
    madeForYouSongs: Song[];
    trendingSongs: Song[];
    featuredSongs: Song[];

    fetchAlbums: () => Promise<void>;
    fetchAlbumById: (id: string) => Promise<void>;
    fetchMadeForYouSongs: () => Promise<void>;
    fetchTrendingSongs: () => Promise<void>;
    fetchFeaturedSongs: () => Promise<void>;

}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    isSongsLoading: false,
    isAlbumsLoading: false,
    isMadeForYouLoading: false,
    isFeaturedLoading: false,
    isTrendingLoading: false,
    error: null,
    currentAlbum: null,
    madeForYouSongs: [],
    trendingSongs: [],
    featuredSongs: [],

    fetchAlbums: async () => {
        set({ isAlbumsLoading: true, error: null });
        try {
            const response = await axiosInstance.get('/albums');
            set({ albums: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isAlbumsLoading: false })
        }
    },

    fetchAlbumById: async (id) => {
        set({ isSongsLoading: true, error: null });
        try {
            const response = await axiosInstance.get(`/albums/${id}`);
            set({ currentAlbum: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message })
        } finally {
            set({ isSongsLoading: false });
        }
    },

    fetchMadeForYouSongs: async () => {
        set({ isMadeForYouLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/songs/made-for-you");

            set({ madeForYouSongs: response.data });

        } catch (error: any) {
            set({ error: error.response.data.message })

        } finally {
            set({ isMadeForYouLoading: false })
        }

    },

    fetchTrendingSongs: async () => {
        set({ isTrendingLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/songs/trending");

            set({ trendingSongs: response.data });

        } catch (error: any) {
            set({ error: error.response.data.message });

        } finally {
            set({ isTrendingLoading: false });
        }
    },

    fetchFeaturedSongs: async () => {
        set({isFeaturedLoading: true, error: null});

        try {
            const response = await axiosInstance.get("/songs/featured");
            set({ featuredSongs: response.data });

        } catch (error: any) {
            set({ error: error.response.data.message });

        } finally {
            set({isFeaturedLoading: false});
        }
    }
}));

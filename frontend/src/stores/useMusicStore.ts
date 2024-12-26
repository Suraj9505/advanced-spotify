import { axiosInstance } from '@/lib/axios';
import { Album, Song, Stats } from '@/types';
import { toast } from 'react-hot-toast';
import { create } from 'zustand'

interface MusicStore {
    albums: Album[];
    songs: Song[];
    stats: Stats;
    isAllSongsLoading: boolean;
    isStatsLoading: boolean;
    isSongDeleteLoading: boolean;
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
    fetchStats: () => Promise<void>;
    fetchSongs: () => Promise<void>;
    deleteSong: (id: string) => Promise<void>;
    deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
    albums: [],
    songs: [],
    stats: {
        totalAlbums: 0,
        totalSongs: 0,
        totalUsers: 0,
        totalArtists: 0,
    },
    isAllSongsLoading: false,
    isStatsLoading: false,
    isSongsLoading: false,
    isAlbumsLoading: false,
    isMadeForYouLoading: false,
    isFeaturedLoading: false,
    isSongDeleteLoading: false,
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
    },

    fetchStats: async () => {
        set({ isStatsLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/stats");
            set({ stats: response.data });

        } catch (error:any) {
            set({ error: error.message });

        } finally {
            set({ isStatsLoading: false });
        }
    },

    fetchSongs: async () => {
        set({ isAllSongsLoading: true, error: null });

        try {
            const response = await axiosInstance.get("/songs");
            set({ songs: response.data });

        } catch (error:any) {
            set({ error: error.message });

        } finally {
            set({ isAllSongsLoading: false });
        }
    },

    deleteSong: async (id) => {
        set({ isSongDeleteLoading: true, error: null });
        try {
             await axiosInstance.delete(`/admin/songs/${id}`);

             set(state => ({
                songs: state.songs.filter(song => song._id !== id)
             }))

             toast.success("Song deleted Successfully");

        } catch (error:any) {
            toast.error(error.message);
            set({ error: error.message})

        } finally {
            set({ isSongDeleteLoading: false})
        }
    },

    deleteAlbum: async (id) => {
        set({ error: null });

        try {
            await axiosInstance.delete(`/admin/albums/${id}`);

            set(state => ({
                albums: state.albums.filter(album => album._id !== id),
                songs: state.songs.map((song) =>
                song.albumId === state.albums.find((a) => a._id === id)?.title ? {...song, album: null} : song,
                ),
            }));

            toast.success("Album deleted successfully");

        } catch (error:any) {
            set({error: error.message});
            toast.error(error.message);
        }
    }
}));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie, WatchStatus, WatchlistEntry } from '@/types';

interface WatchlistState {
  watchlist:      WatchlistEntry[];
  addToList:      (movie: Movie, status?: WatchStatus) => void;
  removeFromList: (id: number) => void;
  updateStatus:   (id: number, status: WatchStatus) => void;
  isInList:       (id: number) => boolean;
  getStatus:      (id: number) => WatchStatus | null;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],

      addToList: (movie: Movie, status: WatchStatus = 'want-to-watch') =>
        set((state) => {
          if (state.watchlist.some((m) => m.id === movie.id)) return state;
          const entry: WatchlistEntry = {
            ...movie,
            status,
            addedAt: new Date().toISOString(),
          };
          return { watchlist: [...state.watchlist, entry] };
        }),

      removeFromList: (id: number) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        })),

      updateStatus: (id: number, status: WatchStatus) =>
        set((state) => ({
          watchlist: state.watchlist.map((m) =>
            m.id === id ? { ...m, status } : m
          ),
        })),

      isInList: (id: number) =>
        get().watchlist.some((m) => m.id === id),

      getStatus: (id: number) =>
        get().watchlist.find((m) => m.id === id)?.status ?? null,
    }),
    {
      name:    'watchlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Movie } from '@/types';

interface FavoritesState {
  favorites:      Movie[];
  addFavorite:    (movie: Movie) => void;
  removeFavorite: (id: number) => void;
  isFavorite:     (id: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (movie: Movie) =>
        set((state) => {
          if (state.favorites.some((m) => m.id === movie.id)) return state;
          return { favorites: [...state.favorites, movie] };
        }),

      removeFavorite: (id: number) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== id),
        })),

      isFavorite: (id: number) =>
        get().favorites.some((m) => m.id === id),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name:    'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
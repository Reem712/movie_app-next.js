import { create } from 'zustand';
import { fetchTrending, fetchNewReleases, fetchPopular } from '@/services/movieService';
import { Movie } from '@/types';

interface MovieState {
  trending:          Movie[];
  newReleases:       Movie[];
  popular:           Movie[];
  selectedMovie:     Movie | null;
  isTrendingLoading: boolean;
  isNewLoading:      boolean;
  isPopularLoading:  boolean;
  isRefreshing:      boolean;
  setSelectedMovie:  (movie: Movie) => void;
  fetchAll:          () => Promise<void>;
  refreshAll:        () => Promise<void>;
}

export const useMovieStore = create<MovieState>((set) => ({
  trending:          [],
  newReleases:       [],
  popular:           [],
  selectedMovie:     null,
  isTrendingLoading: false,
  isNewLoading:      false,
  isPopularLoading:  false,
  isRefreshing:      false,

  setSelectedMovie: (movie) => set({ selectedMovie: movie }),

  fetchAll: async () => {
    set({ isTrendingLoading: true, isNewLoading: true, isPopularLoading: true });
    const [trendingRes, newRes, popularRes] = await Promise.allSettled([
      fetchTrending(), fetchNewReleases(), fetchPopular(),
    ]);
    set({
      trending:          trendingRes.status === 'fulfilled' ? trendingRes.value : [],
      newReleases:       newRes.status      === 'fulfilled' ? newRes.value      : [],
      popular:           popularRes.status  === 'fulfilled' ? popularRes.value  : [],
      isTrendingLoading: false,
      isNewLoading:      false,
      isPopularLoading:  false,
    });
  },

  refreshAll: async () => {
    set({ isRefreshing: true });
    const [trendingRes, newRes, popularRes] = await Promise.allSettled([
      fetchTrending(), fetchNewReleases(), fetchPopular(),
    ]);
    set({
      trending:    trendingRes.status === 'fulfilled' ? trendingRes.value : [],
      newReleases: newRes.status      === 'fulfilled' ? newRes.value      : [],
      popular:     popularRes.status  === 'fulfilled' ? popularRes.value  : [],
      isRefreshing: false,
    });
  },
}));
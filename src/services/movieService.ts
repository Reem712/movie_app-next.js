import { tmdbClient } from './api';
import { Movie } from '@/types';

const IMG_BASE = 'https://image.tmdb.org/t/p';

export const getPosterUrl = (
  posterPath: string | undefined,
  size: 'w185' | 'w342' | 'w500' = 'w342'
): string => {
  if (!posterPath) return '/placeholder-movie.png';
  return `${IMG_BASE}/${size}${posterPath}`;
};

const mapMovie = (m: any): Movie => ({
  id:           m.id,
  tmdb_id:      m.id,
  title:        m.title ?? 'Unknown Title',
  director:     m.director ?? m.original_title ?? '',
  poster_path:  m.poster_path,
  release_year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : undefined,
  genres:       m.genre_ids?.slice(0, 3),
  overview:     m.overview,
  vote_average: m.vote_average,
});

const fetchMovies = async (endpoint: string, params = {}): Promise<Movie[]> => {
  const { data } = await tmdbClient.get(endpoint, { params });
  return (data.results ?? []).map(mapMovie);
};

export const fetchTrending    = () => fetchMovies('/trending/movie/week');
export const fetchNewReleases = () => fetchMovies('/movie/now_playing');
export const fetchPopular     = () => fetchMovies('/movie/popular');

export const searchMovies = (query: string) =>
  fetchMovies('/search/movie', { query });

export const fetchMovieDetail = async (movieId: number): Promise<Partial<Movie>> => {
  const { data } = await tmdbClient.get(`/movie/${movieId}`);
  return {
    overview:     data.overview,
    genres:       data.genres?.map((g: any) => g.name).slice(0, 5),
    vote_average: data.vote_average,
    release_year: data.release_date ? parseInt(data.release_date.slice(0, 4)) : undefined,
  };
};
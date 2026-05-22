export interface Movie {
  id: number;
  title: string;
  director: string;
  poster_path?: string;
  release_year?: number;
  genres?: string[];
  overview?: string;
  vote_average?: number;
  tmdb_id?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  token: string;
}

export type WatchStatus = 'want-to-watch' | 'watching' | 'watched';

export interface WatchlistEntry extends Movie {
  status: WatchStatus;
  addedAt: string;
}
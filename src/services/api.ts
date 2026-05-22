import axios from 'axios';

export const authClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

export const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 12_000,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    language: 'en-US',
  },
});

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.status_message ??
      error.response?.data?.error ??
      error.message ??
      'An unexpected error occurred.';
    throw new Error(message);
  }
  throw error;
};

authClient.interceptors.response.use((r) => r, handleError);
tmdbClient.interceptors.response.use((r) => r, handleError);
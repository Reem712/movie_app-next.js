'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight } from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { searchMovies, getPosterUrl } from '@/services/movieService';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Movie } from '@/types';

const TRENDING_SEARCHES = ['Dune', 'Nolan', 'Horror 2024', 'Anime', 'Tarantino', 'A24'];

export default function SearchPage() {
  const router = useRouter();
  const setSelectedMovie = useMovieStore((s) => s.setSelectedMovie);

  const [query, setQuery]     = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched]   = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearched(true);
    try {
      const movies = await searchMovies(query.trim());
      setResults(movies);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handlePress = (movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}?title=${encodeURIComponent(movie.title)}`);
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8F7F4] font-sans text-[#1A1A2E]">

      {/* ── Header ── */}
      <div className="border-b border-black/[0.06] bg-gradient-to-b from-[#EDE5D8] to-[#F8F7F4] px-[clamp(18px,4vw,40px)] pb-[18px] pt-[clamp(20px,4vw,36px)]">
        <div className="mx-auto max-w-[760px]">
          <h1 className="mb-4 text-[clamp(22px,4vw,32px)] font-extrabold tracking-tight text-[#1A1A2E]">
            Search
          </h1>

          {/* Input */}
          <div className="relative mb-2.5">
            <Search
              size={17}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search movies, directors…"
              className="w-full rounded-xl border border-black/10 bg-white py-3 pl-11 pr-11 text-[14px] text-[#1A1A2E] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-black/20"
            />
            {query && (
              <button
                onClick={clear}
                className="absolute right-3 top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-md bg-black/8 text-[#6B7280] transition-colors hover:bg-black/15 hover:text-[#1A1A2E]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6c63ff] py-3 text-[14px] font-bold text-white transition-opacity disabled:opacity-50"
          >
            <Search size={14} />
            {isLoading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </div>

      {/* ── Trending tags ── */}
      {!searched && (
        <div className="mx-auto max-w-[760px] px-[clamp(18px,4vw,40px)] pt-[18px]">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            Trending Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); handleSearch(); }}
                className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#6B7280] transition-colors hover:border-black/20 hover:text-[#1A1A2E]"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <main className="mx-auto max-w-[760px] p-[clamp(14px,3vw,28px)_clamp(18px,4vw,40px)_40px]">

        {isLoading && (
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} width="100%" height={96} borderRadius={13} />
            ))}
          </div>
        )}

        {!isLoading && searched && results.length === 0 && (
          <div className="py-14 text-center">
            <Search size={40} className="mx-auto mb-3.5 block text-[#9CA3AF] opacity-40" />
            <p className="mb-1 text-[15px] font-semibold text-[#1A1A2E]">
              No results found
            </p>
            <p className="m-0 text-[13px] text-[#6B7280]">
              No movies found for "{query}"
            </p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <>
            <p className="mb-3.5 text-[12px] text-[#9CA3AF]">
              {results.length} results
            </p>
            <div className="flex flex-col gap-2.5">
              {results.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handlePress(movie)}
                  className="flex w-full items-center gap-3 rounded-xl border border-black/[0.07] bg-white p-3 text-left shadow-sm transition-all hover:border-black/15 hover:shadow-md"
                >
                  {/* Poster */}
                  <div className="h-[74px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-[#EDEAF4]">
                    <img
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Meta */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-[3px] line-clamp-2 text-[13px] font-bold text-[#1A1A2E]">
                      {movie.title}
                    </p>
                    <p className="mb-[7px] truncate text-[11px] text-[#6B7280]">
                      {movie.director ?? 'Unknown Director'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {movie.release_year && (
                        <span className="rounded-md bg-[#e2b96f]/15 px-2 py-[2px] text-[10px] font-bold text-[#926b1a]">
                          {movie.release_year}
                        </span>
                      )}
                      {movie.genres?.[0] && (
                        <span className="rounded-md bg-[#6c63ff]/10 px-2 py-[2px] text-[10px] font-bold text-[#4f46e5]">
                          {typeof movie.genres[0] === 'string'
                            ? movie.genres[0]
                            : (movie.genres[0] as any).name}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={15} className="shrink-0 text-[#9CA3AF]" />
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
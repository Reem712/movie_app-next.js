'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronRight } from 'lucide-react';

// تأكد من مساراتك (بناءً على مشروعك)
import { useMovieStore } from '@/store/useMovieStore';
import { searchMovies, getPosterUrl } from '@/services/movieService';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Movie } from '@/types';

const TRENDING_SEARCHES = ['Dune', 'Nolan', 'Horror 2024', 'Anime', 'Tarantino', 'A24'];

export default function SearchPage() {
  const router = useRouter();
  // حل إيرور 7006 باستخدام (s: any) وتغيير المسمى لـ Store الأفلام
  const setSelectedMovie = useMovieStore((s: any) => s.setSelectedMovie);

  const [query, setQuery] = useState('');
  // حل إيرور 2304 بتغيير Book لـ Movie
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearched(true);
    try {
      // حل إيرور 2305 بتغيير searchBooks لـ searchMovies
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
    // توجيه المستخدم لصفحة الفيلم بدلاً من الكتاب
    router.push(`/movie/${movie.id}?title=${encodeURIComponent(movie.title)}`);
  };

  const clear = () => { 
    setQuery(''); 
    setResults([]); 
    setSearched(false); 
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] font-sans text-[#f0f0f5]">

      {/* ── Header ── */}
      <div className="border-b border-white/5 bg-gradient-to-b from-[#110d2a] to-[#0a0a0f] px-[clamp(18px,4vw,40px)] pb-[18px] pt-[clamp(20px,4vw,36px)]">
        <div className="mx-auto max-w-[760px]">
          <h1 className="mb-4 text-[clamp(22px,4vw,32px)] font-extrabold tracking-tight text-white">
            Search
          </h1>

          {/* Input */}
          <div className="relative mb-2.5">
            <Search
              size={17}
              className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7a7a90]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search movies, directors…"
              className="w-full rounded-xl border border-white/5 bg-[#13131a] py-3 pl-11 pr-11 text-[14px] text-[#f0f0f5] outline-none transition-colors focus:border-white/20"
            />
            {query && (
              <button
                onClick={clear}
                className="absolute right-3 top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-md bg-white/10 text-[#7a7a90] transition-colors hover:bg-white/20 hover:text-white"
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

      {/* ── Trending tags (when no results) ── */}
      {!searched && (
        <div className="mx-auto max-w-[760px] px-[clamp(18px,4vw,40px)] pt-[18px]">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#7a7a90]">
            Trending Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {TRENDING_SEARCHES.map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); handleSearch(); }}
                className="rounded-full border border-white/5 bg-[#13131a] px-3.5 py-1.5 text-[12px] font-medium text-[#7a7a90] transition-colors hover:border-white/20 hover:text-[#f0f0f5]"
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
          <div className="py-14 text-center text-[#7a7a90]">
            <Search size={40} className="mx-auto mb-3.5 block opacity-20" />
            <p className="mb-1 text-[15px] font-semibold text-[#f0f0f5]">
              No results found
            </p>
            <p className="m-0 text-[13px]">
              No movies found for "{query}"
            </p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <>
            <p className="mb-3.5 text-[12px] text-[#7a7a90]">
              {results.length} results
            </p>
            <div className="flex flex-col gap-2.5">
              {results.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handlePress(movie)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-[#13131a] p-3 text-left transition-colors hover:border-white/15"
                >
                  {/* Poster */}
                  <div className="h-[74px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-[#1a1a24]">
                    <img
                      // حل إيرور 2305 بتغيير getCoverUrl لـ getPosterUrl
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Meta */}
                  <div className="min-w-0 flex-1">
                    <p className="mb-[3px] line-clamp-2 text-[13px] font-bold text-[#f0f0f5]">
                      {movie.title}
                    </p>
                    <p className="mb-[7px] truncate text-[11px] text-[#7a7a90]">
                      {movie.director ?? 'Unknown Director'}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {movie.release_year && (
                        <span className="rounded-md bg-[#e2b96f]/10 px-2 py-[2px] text-[10px] font-bold text-[#e2b96f]">
                          {movie.release_year}
                        </span>
                      )}
                      {/* التعامل الآمن مع الـ genres */}
                      {movie.genres?.[0] && (
                        <span className="rounded-md bg-[#6c63ff]/10 px-2 py-[2px] text-[10px] font-bold text-[#a09af7]">
                          {typeof movie.genres[0] === 'string' ? movie.genres[0] : (movie.genres[0] as any).name}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={15} className="shrink-0 text-[#7a7a90]" />
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
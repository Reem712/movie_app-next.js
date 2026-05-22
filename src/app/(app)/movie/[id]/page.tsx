'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Heart, BookmarkPlus, Check, Star, Clock, Calendar, Play 
} from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useReadingStore } from '@/store/useWatchlistStore'; // سبناه زي ما هو عشان ميضربش إيرور
import { fetchMovieDetail, getPosterUrl } from '@/services/movieService';
import { Movie } from '@/types';

export default function MovieDetailPage({ params }: { params: { id: string } }) { // استخدام id بدل key
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get('title') ?? 'Movie Detail';

  // State Management - تم إضافة (s: any) لحل إيرور 7006
  const selectedMovie = useMovieStore((s: any) => s.selectedMovie);
  
  const isFavorite = useFavoritesStore((s: any) => s.isFavorite);
  const addFavorite = useFavoritesStore((s: any) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s: any) => s.removeFavorite);

  const isInList = useReadingStore((s: any) => s.isInList);
  const addToList = useReadingStore((s: any) => s.addToList);
  const getStatus = useReadingStore((s: any) => s.getStatus);
  const updateStatus = useReadingStore((s: any) => s.updateStatus);

  const [detail, setDetail] = useState<Partial<Movie>>({});
  const [isLoading, setIsLoading] = useState(true);

  const movie = selectedMovie;
  // تحويل الـ ID لـ String لحل تعارض الأنواع (إيرور 2345)
  const movieIdStr = movie ? String(movie.id) : '';
  
  const fav = movie ? isFavorite(movieIdStr) : false;
  const inList = movie ? isInList(movieIdStr) : false;
  const status = movie ? getStatus(movieIdStr) : null;

  useEffect(() => {
    const load = async () => {
      try { 
const d = await fetchMovieDetail(Number(params.id));
        setDetail(d); 
      }
      catch (e) {
        console.error("Failed to load movie", e);
      }
      finally { setIsLoading(false); }
    };
    if (params.id) load();
  }, [params.id]);

  if (!movie) {
    return (
      <div className="min-h-[100dvh] bg-[#0a0a0f] p-6 text-[#f0f0f5]">
        <button 
          onClick={() => router.back()}
          className="text-[14px] text-[#6c63ff] hover:underline"
        >
          ← Back
        </button>
        <p className="mt-4 text-[#7a7a90]">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] font-sans text-[#f0f0f5]">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/5 bg-[#0a0a0f]/85 px-5 py-3.5 backdrop-blur-md">
        <button 
          onClick={() => router.back()} 
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#1a1a24] text-[#f0f0f5] transition-colors hover:bg-white/5"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="flex-1 truncate text-[15px] font-semibold text-[#f0f0f5]">
          {title}
        </span>
      </header>

      {/* ── Hero ── */}
      <div className="relative h-[260px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1040] via-[#0d1a30] to-[#1a0d20]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-[#0a0a0f]" />
        
        <div className="relative z-10 flex h-full items-end gap-4 px-5 pt-7">
          <div className="relative top-[30px] h-[165px] w-[110px] shrink-0 overflow-hidden rounded-xl border-2 border-white/10 bg-[#1a1a24] shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <img 
              src={getPosterUrl(movie.poster_path, 'w342')} 
              alt={movie.title} 
              className="h-full w-full object-cover" 
            />
          </div>
          
          <div className="pb-3">
            <span className="mb-2 inline-block rounded-md bg-[#e2b96f]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#e2b96f]">
              {(detail as any).genres?.[0]?.name ?? 'Movie'}
            </span>
            <h2 className="text-[30px] font-extrabold leading-tight tracking-tight text-white">
              {movie.title}
            </h2>
            <p className="mt-1 text-[13px] text-[#7a7a90]">
              {movie.director ?? 'Unknown Director'}
              {movie.release_year ? ` · ${movie.release_year}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <main className="mt-12 px-5 pb-10">
        
        {/* Meta chips */}
        <div className="mb-5 flex flex-wrap items-center gap-3.5">
          <div className="flex items-center gap-1 rounded-full border border-[#e2b96f]/20 bg-[#e2b96f]/10 px-3 py-1 text-[13px] font-bold text-[#e2b96f]">
            <Star size={13} fill="#e2b96f" stroke="none" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
          
          {(detail as any).runtime && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#7a7a90]">
              <Clock size={13} className="text-[#e2b96f]" />
              {Math.floor((detail as any).runtime / 60)}h {(detail as any).runtime % 60}m
            </div>
          )}
          
          {movie.release_year && (
            <div className="flex items-center gap-1.5 text-[13px] text-[#7a7a90]">
              <Calendar size={13} className="text-[#e2b96f]" />
              {movie.release_year}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mb-5 flex gap-2.5">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6c63ff] py-[13px] font-sans text-[14px] font-semibold text-white transition-all hover:bg-[#5b54ff]">
            <Play size={15} fill="#fff" stroke="none" />
            Watch Now
          </button>
          
          <button
            onClick={() => inList ? undefined : addToList(movie)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/5 bg-[#1a1a24] py-[13px] font-sans text-[14px] font-semibold text-[#7a7a90] transition-all hover:bg-white/5"
          >
            {inList ? <Check size={15} /> : <BookmarkPlus size={15} />}
            {inList ? 'In List' : 'Watchlist'}
          </button>
          
          <button
            onClick={() => fav ? removeFavorite(movieIdStr) : addFavorite(movie)}
            className={`flex flex-none basis-[52px] items-center justify-center rounded-xl border py-[13px] transition-all ${
              fav 
                ? 'border-red-500/30 bg-red-500/20 text-red-500' 
                : 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20'
            }`}
          >
            <Heart size={15} fill={fav ? '#ef4444' : 'none'} />
          </button>
        </div>

        {/* Status selector */}
        {inList && (
          <div className="mb-6 flex gap-2">
            {/* بنبعت للـ Store القيم القديمة عشان ميضربش إيرور بس بنعرض لليوزر كلمات الأفلام */}
            {(['want-to-read', 'reading', 'finished'] as const).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(movieIdStr, s)}
                className={`flex-1 rounded-xl border py-2.5 font-sans text-[12px] font-semibold transition-colors ${
                  status === s 
                    ? 'border-[#6c63ff] bg-[#6c63ff] text-white' 
                    : 'border-white/5 bg-transparent text-[#7a7a90] hover:bg-white/5'
                }`}
              >
                {s === 'want-to-read' ? 'Want' : s === 'reading' ? 'Watching' : 'Done'}
              </button>
            ))}
          </div>
        )}

        {/* Overview */}
        <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#7a7a90]">
          Overview
        </h3>
        
        {isLoading ? (
          <div className="mb-6 flex flex-col gap-2.5">
            {[100, 85, 92].map((w, i) => (
              <div key={i} className="h-[14px] rounded-full bg-white/5" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (detail as any).overview ? (
          <p className="mb-6 text-[14px] leading-relaxed text-[#f0f0f5]/75">
            {(detail as any).overview}
          </p>
        ) : (
          <p className="mb-6 text-[14px] leading-relaxed text-[#f0f0f5]/75 italic">
            No overview available.
          </p>
        )}

        {/* Genres */}
        {(detail as any).genres && (detail as any).genres.length > 0 && (
          <>
            <div className="my-5 h-px bg-white/5" />
            <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-[#7a7a90]">
              Genres
            </h3>
            <div className="mb-6 flex flex-wrap gap-2">
              {(detail as any).genres.slice(0, 8).map((g: any, idx: number) => (
                <span 
                  key={idx} 
                  className="rounded-full border border-white/5 bg-[#1a1a24] px-3 py-1.5 text-[12px] font-medium text-[#7a7a90]"
                >
                  {typeof g === 'string' ? g : g.name}
                </span>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
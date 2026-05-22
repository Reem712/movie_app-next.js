'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Heart, BookmarkPlus, BookmarkCheck, Star, Clock, Calendar, Play,
  Check, Film,
} from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { fetchMovieDetail, getPosterUrl } from '@/services/movieService';
import { Movie } from '@/types';

type WatchStatus = 'want-to-watch' | 'watching' | 'watched';

interface MovieDetailProps {
  params: { id: string };
}

const STATUS_OPTIONS: { key: WatchStatus; label: string; emoji: string }[] = [
  { key: 'want-to-watch', label: 'Want to Watch', emoji: '🎯' },
  { key: 'watching',      label: 'Watching',      emoji: '▶' },
  { key: 'watched',       label: 'Watched',        emoji: '✓'  },
];

export default function MovieDetailPage({ params }: MovieDetailProps) {
  const { id } = params;
  const router       = useRouter();
  const searchParams = useSearchParams();
  const title        = searchParams.get('title') ?? 'Movie Detail';

  const selectedMovie  = useMovieStore((s) => s.selectedMovie);
  const isFavorite     = useFavoritesStore((s) => s.isFavorite);
  const addFavorite    = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const isInList       = useWatchlistStore((s) => s.isInList);
  const addToList      = useWatchlistStore((s) => s.addToList);
  const removeFromList = useWatchlistStore((s) => s.removeFromList);
  const getStatus      = useWatchlistStore((s) => s.getStatus);
  const updateStatus   = useWatchlistStore((s) => s.updateStatus);

  const [detail, setDetail]       = useState<Partial<Movie>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [heartBurst, setHeartBurst] = useState(false);
  const [watchlistPop, setWatchlistPop] = useState(false);

  const movie   = selectedMovie;
  const movieId = movie?.id ?? 0;
  const fav     = movie ? isFavorite(movieId) : false;
  const inList  = movie ? isInList(movieId)   : false;
  const status  = movie ? getStatus(movieId)  : null;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const d = await fetchMovieDetail(Number(id));
        setDetail(d);
      } catch (e) {
        console.error('Failed to load movie:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleFav = () => {
    if (!movie) return;
    if (!fav) {
      setHeartBurst(true);
      setTimeout(() => setHeartBurst(false), 600);
      addFavorite(movie);
    } else {
      removeFavorite(movieId);
    }
  };

  const handleWatchlist = () => {
    if (!movie) return;
    if (!inList) {
      setWatchlistPop(true);
      setTimeout(() => setWatchlistPop(false), 500);
      addToList(movie);
    } else {
      removeFromList?.(movieId);
    }
  };

  const runtime = (detail as any).runtime as number | undefined;
  const genres  = (detail as any).genres  as { name: string }[] | undefined;
  const overview = (detail as any).overview as string | undefined;

  const posterUrl = getPosterUrl(movie?.poster_path, 'w500');

  if (!movie) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#0d0c18',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif", color: '#fff', gap: 16,
      }}>
        <Film size={40} color="#6c63ff" strokeWidth={1.5} />
        <p style={{ fontSize: 15, color: '#9490B0' }}>Movie not found.</p>
        <button onClick={() => router.back()} style={{
          padding: '10px 22px', borderRadius: 12, background: '#6c63ff',
          border: 'none', color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#0d0c18',
      fontFamily: "'Outfit', 'DM Sans', -apple-system, sans-serif",
      color: '#f0eef8',
      overflowX: 'hidden',
    }}>

      {/* ── Cinematic blurred poster bg ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      }}>
        <img
          src={posterUrl}
          alt=""
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'blur(60px) saturate(1.4) brightness(0.22)',
            transform: 'scale(1.1)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,12,24,0.55) 0%, rgba(13,12,24,0.92) 55%, #0d0c18 100%)',
        }} />
      </div>

      {/* ── Sticky header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px',
        background: 'rgba(13,12,24,0.72)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <button onClick={() => router.back()} style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#f0eef8', transition: 'background 0.15s',
        }}>
          <ArrowLeft size={17} />
        </button>
        <span style={{
          flex: 1, fontSize: 14, fontWeight: 700, color: '#f0eef8',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</span>
      </header>

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero area: poster + title ── */}
        <div style={{
          display: 'flex', gap: 'clamp(18px, 4vw, 36px)',
          padding: 'clamp(28px,5vw,56px) clamp(18px,5vw,40px) 0',
          maxWidth: 860, margin: '0 auto',
          flexWrap: 'wrap',
        }}>

          {/* Poster */}
          <div style={{
            flexShrink: 0,
            width: 'clamp(130px, 22vw, 200px)',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 28px 72px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)',
            animation: 'cin-rise 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
          }}>
            <img
              src={posterUrl}
              alt={movie.title}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>

          {/* Title block */}
          <div style={{
            flex: '1 1 220px', minWidth: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            paddingBottom: 4,
            animation: 'cin-fade-up 0.45s 0.1s ease both',
          }}>
            {/* Genre badge */}
            {genres?.[0] && (
              <span style={{
                display: 'inline-block', marginBottom: 12,
                padding: '4px 12px', borderRadius: 20,
                background: 'rgba(226,185,111,0.15)',
                border: '1px solid rgba(226,185,111,0.28)',
                fontSize: 10, fontWeight: 800,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#e2b96f',
                alignSelf: 'flex-start',
              }}>
                {genres[0].name}
              </span>
            )}

            <h1 style={{
              fontSize: 'clamp(22px, 4vw, 38px)',
              fontWeight: 900, lineHeight: 1.1,
              letterSpacing: -0.8, margin: '0 0 8px',
              color: '#fff',
            }}>
              {movie.title}
            </h1>

            <p style={{ fontSize: 13, color: '#7a7898', margin: '0 0 18px' }}>
              {movie.director ?? 'Unknown Director'}
              {movie.release_year ? ` · ${movie.release_year}` : ''}
            </p>

            {/* Meta chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(movie.vote_average ?? 0) > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 20,
                  background: 'rgba(226,185,111,0.12)',
                  border: '1px solid rgba(226,185,111,0.22)',
                }}>
                  <Star size={12} fill="#e2b96f" color="#e2b96f" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#e2b96f' }}>
                    {movie.vote_average!.toFixed(1)}
                  </span>
                </div>
              )}
              {runtime && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}>
                  <Clock size={12} color="#9490B0" />
                  <span style={{ fontSize: 12, color: '#9490B0', fontWeight: 600 }}>
                    {Math.floor(runtime / 60)}h {runtime % 60}m
                  </span>
                </div>
              )}
              {movie.release_year && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}>
                  <Calendar size={12} color="#9490B0" />
                  <span style={{ fontSize: 12, color: '#9490B0', fontWeight: 600 }}>
                    {movie.release_year}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{
          maxWidth: 860, margin: '0 auto',
          padding: '24px clamp(18px,5vw,40px) 0',
          display: 'flex', gap: 10, flexWrap: 'wrap',
          animation: 'cin-fade-up 0.45s 0.2s ease both',
        }}>

          {/* Watch Now */}
          <button style={{
            flex: '1 1 140px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 20px', borderRadius: 14,
            background: 'linear-gradient(135deg, #7c74ff 0%, #5b52ee 100%)',
            border: 'none', color: '#fff',
            fontSize: 14, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 8px 28px rgba(108,99,255,0.38)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 14px 36px rgba(108,99,255,0.48)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none', e.currentTarget.style.boxShadow = '0 8px 28px rgba(108,99,255,0.38)')}
          >
            <Play size={15} fill="#fff" color="#fff" />
            Watch Now
          </button>

          {/* Watchlist button */}
          <button
            onClick={handleWatchlist}
            style={{
              flex: '1 1 120px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px 20px', borderRadius: 14, cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
              transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              border: inList
                ? '1px solid rgba(108,99,255,0.5)'
                : '1px solid rgba(255,255,255,0.1)',
              background: inList
                ? 'rgba(108,99,255,0.18)'
                : 'rgba(255,255,255,0.06)',
              color: inList ? '#a89fff' : '#9490B0',
              transform: watchlistPop ? 'scale(1.07)' : 'scale(1)',
              boxShadow: inList ? '0 0 0 3px rgba(108,99,255,0.15)' : 'none',
            }}
          >
            {inList
              ? <BookmarkCheck size={15} color="#a89fff" />
              : <BookmarkPlus size={15} />
            }
            {inList ? 'In Watchlist' : 'Add to List'}
          </button>

          {/* Heart / Favorite */}
          <button
            onClick={handleFav}
            style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontFamily: 'inherit',
              border: fav ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
              background: fav ? 'rgba(239,68,68,0.14)' : 'rgba(255,255,255,0.06)',
              transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
              transform: heartBurst ? 'scale(1.22)' : 'scale(1)',
              boxShadow: fav ? '0 0 0 4px rgba(239,68,68,0.12)' : 'none',
              position: 'relative', overflow: 'visible',
            }}
          >
            <Heart
              size={18}
              fill={fav ? '#ef4444' : 'none'}
              color={fav ? '#ef4444' : '#9490B0'}
              style={{
                transition: 'fill 0.18s ease, color 0.18s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: heartBurst ? 'scale(1.3)' : 'scale(1)',
                filter: fav ? 'drop-shadow(0 0 6px rgba(239,68,68,0.55))' : 'none',
              }}
            />
            {/* Burst particles */}
            {heartBurst && (
              <span style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                animation: 'cin-burst 0.5s ease forwards',
                pointerEvents: 'none',
                background: 'radial-gradient(circle, rgba(239,68,68,0.45) 0%, transparent 70%)',
              }} />
            )}
          </button>
        </div>

        {/* ── Watch status selector ── */}
        {inList && (
          <div style={{
            maxWidth: 860, margin: '16px auto 0',
            padding: '0 clamp(18px,5vw,40px)',
            animation: 'cin-fade-up 0.3s ease both',
          }}>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#55556a', marginBottom: 10,
            }}>
              Watch Status
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUS_OPTIONS.map(({ key, label, emoji }) => {
                const active = status === key;
                return (
                  <button
                    key={key}
                    onClick={() => updateStatus(movieId, key)}
                    style={{
                      flex: 1, padding: '10px 6px', borderRadius: 12,
                      border: active
                        ? '1px solid rgba(108,99,255,0.6)'
                        : '1px solid rgba(255,255,255,0.08)',
                      background: active
                        ? 'linear-gradient(135deg, rgba(108,99,255,0.28), rgba(92,83,238,0.18))'
                        : 'rgba(255,255,255,0.04)',
                      color: active ? '#c4bfff' : '#55556a',
                      fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 4,
                      boxShadow: active ? '0 0 0 3px rgba(108,99,255,0.12)' : 'none',
                      transform: active ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{emoji}</span>
                    <span>{label}</span>
                    {active && (
                      <span style={{
                        width: 16, height: 2, borderRadius: 1,
                        background: '#7c74ff', display: 'block',
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{
          maxWidth: 860, margin: '28px auto 0',
          padding: '0 clamp(18px,5vw,40px)',
        }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* ── Overview ── */}
        <div style={{
          maxWidth: 860, margin: '24px auto 0',
          padding: '0 clamp(18px,5vw,40px)',
          animation: 'cin-fade-up 0.45s 0.3s ease both',
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: '#55556a', marginBottom: 12,
          }}>
            Overview
          </p>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[100, 88, 74].map((w, i) => (
                <div key={i} style={{
                  height: 13, borderRadius: 6,
                  background: 'rgba(255,255,255,0.07)',
                  width: `${w}%`,
                  animation: `cin-shimmer 1.4s ${i * 0.15}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          ) : overview ? (
            <p style={{
              fontSize: 14, lineHeight: 1.75, color: '#9490B0',
              margin: 0,
            }}>
              {overview}
            </p>
          ) : (
            <p style={{ fontSize: 14, color: '#55556a', fontStyle: 'italic', margin: 0 }}>
              No overview available.
            </p>
          )}
        </div>

        {/* ── Genres ── */}
        {genres && genres.length > 0 && (
          <div style={{
            maxWidth: 860, margin: '28px auto 0',
            padding: '0 clamp(18px,5vw,40px)',
            animation: 'cin-fade-up 0.45s 0.35s ease both',
          }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 24 }} />
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.09em',
              textTransform: 'uppercase', color: '#55556a', marginBottom: 12,
            }}>
              Genres
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {genres.slice(0, 8).map((g, idx) => (
                <span key={idx} style={{
                  padding: '7px 16px', borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.09)',
                  background: 'rgba(255,255,255,0.05)',
                  fontSize: 12, fontWeight: 600, color: '#9490B0',
                }}>
                  {typeof g === 'string' ? g : g.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: 56 }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

        @keyframes cin-rise {
          from { opacity: 0; transform: translateY(28px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes cin-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cin-burst {
          0%   { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        @keyframes cin-shimmer {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid, List, ChevronLeft, ChevronRight,
  Clapperboard, Search, X, Star, Play,
} from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { useTheme } from '@/hooks/useTheme';
import { getPosterUrl, searchMovies } from '@/services/movieService';
import { tmdbClient } from '@/services/api';
import SkeletonLoader from '@/components/SkeletonLoader';
import { Movie } from '@/types';

const GENRES = [
  { key: '28',  label: 'Action',   color: '#F43F5E' },
  { key: '18',  label: 'Drama',    color: '#8B5CF6' },
  { key: '878', label: 'Sci-Fi',   color: '#06B6D4' },
  { key: '27',  label: 'Horror',   color: '#F97316' },
  { key: '35',  label: 'Comedy',   color: '#22C55E' },
  { key: '53',  label: 'Thriller', color: '#A78BFA' },
];

const TRENDING_SEARCHES = ['Dune', 'Nolan', 'Horror 2024', 'Anime', 'Tarantino', 'A24'];

const PAGE_SIZE = 20;

const mapMovie = (m: any): Movie => ({
  id:           m.id,
  tmdb_id:      m.id,
  title:        m.title ?? 'Unknown Title',
  director:     m.original_title ?? '',
  poster_path:  m.poster_path,
  release_year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : undefined,
  genres:       m.genre_ids?.slice(0, 3),
  vote_average: m.vote_average,
});

/* ─── Command Palette (same as HomePage) ───────────────────────────────────── */
function CommandPalette({
  open, onClose, onSelect, T, font, isDark,
}: {
  open: boolean; onClose: () => void; onSelect: (m: Movie) => void;
  T: Record<string, string>; font: string; isDark: boolean;
}) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Movie[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [activeIdx, setActive]  = useState(0);
  const inputRef                = useRef<HTMLInputElement>(null);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setQuery(''); setResults([]); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
      if (!open) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[activeIdx]) { onSelect(results[activeIdx]); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, activeIdx, onSelect, onClose]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const movies = await searchMovies(query.trim());
        setResults(movies.slice(0, 8)); setActive(0);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: isDark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.42)',
        backdropFilter: 'blur(6px)', zIndex: 200,
        animation: 'cin-fade-in 0.15s ease',
      }} />
      <div style={{
        position: 'fixed', top: '12vh', left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(640px, calc(100vw - 32px))',
        background: isDark ? '#18172a' : '#fff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: 18,
        boxShadow: isDark
          ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,99,255,0.2)'
          : '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(108,99,255,0.12)',
        zIndex: 201, overflow: 'hidden',
        animation: 'cin-slide-up 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        }}>
          <Search size={18} color={T.muted} style={{ flexShrink: 0 }} />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, directors..."
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 16, fontWeight: 500, color: T.text, fontFamily: font,
            }} />
          {query && (
            <button onClick={() => setQuery('')} style={{
              width: 22, height: 22, borderRadius: 6,
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <X size={12} color={T.muted} />
            </button>
          )}
          <kbd style={{
            fontSize: 11, color: T.muted,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 6, padding: '3px 8px', fontFamily: 'monospace', flexShrink: 0,
          }}>ESC</kbd>
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {!query && (
            <div style={{ padding: '14px 18px 16px' }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: T.muted, margin: '0 0 10px',
              }}>Trending Searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {TRENDING_SEARCHES.map((tag) => (
                  <button key={tag} onClick={() => setQuery(tag)} style={{
                    padding: '6px 14px', borderRadius: 20,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    color: T.sub, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: font,
                  }}>{tag}</button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div style={{ padding: '10px 18px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SkeletonLoader width={40} height={56} borderRadius={8} />
                  <div style={{ flex: 1 }}>
                    <SkeletonLoader width="60%" height={12} borderRadius={4} />
                    <div style={{ marginTop: 6 }}><SkeletonLoader width="40%" height={10} borderRadius={4} /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div style={{ padding: '8px 10px' }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: T.muted, margin: '6px 8px 8px',
              }}>{results.length} results</p>
              {results.map((movie, idx) => {
                const active = idx === activeIdx;
                return (
                  <button key={movie.id}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => { onSelect(movie); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', padding: '9px 10px', borderRadius: 10,
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: active
                        ? isDark ? 'rgba(108,99,255,0.14)' : 'rgba(108,99,255,0.08)'
                        : 'transparent',
                      transition: 'background 0.1s', fontFamily: font,
                    }}>
                    <div style={{
                      width: 40, height: 56, borderRadius: 8, overflow: 'hidden',
                      flexShrink: 0, background: isDark ? '#2a2840' : '#EDEAF4',
                    }}>
                      <img src={getPosterUrl(movie.poster_path, 'w185')} alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 700, color: T.text, margin: '0 0 3px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{movie.title}</p>
                      <p style={{
                        fontSize: 11, color: T.sub, margin: '0 0 5px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{movie.director ?? 'Unknown Director'}</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {movie.release_year && (
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#926b1a',
                            background: 'rgba(226,185,111,0.15)', borderRadius: 5, padding: '1px 7px',
                          }}>{movie.release_year}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} color={active ? '#6c63ff' : T.muted} style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div style={{ padding: '32px 18px', textAlign: 'center' }}>
              <Search size={32} color={T.muted} style={{ opacity: 0.3, marginBottom: 10 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: '0 0 4px' }}>No results found</p>
              <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>Try a different title or director</p>
            </div>
          )}
        </div>

        <div style={{
          padding: '10px 18px',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          display: 'flex', gap: 14,
        }}>
          {[
            { key: '↵', label: 'to select' },
            { key: '↑↓', label: 'to navigate' },
            { key: 'ESC', label: 'to close' },
          ].map(({ key, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <kbd style={{
                fontSize: 10, color: T.muted,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 4, padding: '1px 6px', fontFamily: 'monospace',
              }}>{key}</kbd>
              <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function BrowsePage() {
  const setSelectedMovie = useMovieStore((s) => s.setSelectedMovie);
  const router           = useRouter();
  const { isDark }       = useTheme();

  const [activeGenre, setActiveGenre] = useState(GENRES[0].key);
  const [view, setView]               = useState<'grid' | 'list'>('grid');
  const [movies, setMovies]           = useState<Movie[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const [hoveredId, setHoveredId]     = useState<number | null>(null);
  const [searchOpen, setSearchOpen]   = useState(false);

  const fetchMovies = useCallback(async (genre: string, pg: number) => {
    setIsLoading(true);
    try {
      const { data } = await tmdbClient.get('/discover/movie', {
        params: { with_genres: genre, page: pg, sort_by: 'popularity.desc' },
      });
      setMovies((data.results ?? []).map(mapMovie));
      setTotal(data.total_results ?? 0);
    } catch { setMovies([]); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { setPage(1); fetchMovies(activeGenre, 1); }, [activeGenre, fetchMovies]);
  useEffect(() => { fetchMovies(activeGenre, page); }, [page, activeGenre, fetchMovies]);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handlePress = (movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  };

  const totalPages = Math.ceil(Math.min(total, 10000) / 20);
  const genreMeta  = GENRES.find((g) => g.key === activeGenre)!;

  const T = {
    bg:         isDark ? '#0a0a0f' : '#F7F5F0',
    surface:    isDark ? '#1a1a24' : '#FFFFFF',
    card:       isDark ? '#13131c' : '#F0EDE8',
    border:     isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)',
    text:       isDark ? '#f0f0f5' : '#1A1625',
    sub:        isDark ? '#7a7a90' : '#6B6580',
    muted:      isDark ? '#55556a' : '#A09BB5',
    accent:     '#6c63ff',
    accentGold: '#e2b96f',
    accentGlow: isDark ? 'rgba(108,99,255,0.18)' : 'rgba(108,99,255,0.12)',
    headerBg:   isDark
      ? 'linear-gradient(160deg, #1a1040 0%, #0a0a0f 60%)'
      : 'linear-gradient(160deg, #DDD5F0 0%, #F7F5F0 60%)',
  };

  const font = "'Outfit', 'DM Sans', -apple-system, sans-serif";

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, fontFamily: font, color: T.text }}>

      {/* Command Palette */}
      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(movie) => { handlePress(movie); setSearchOpen(false); }}
        T={T} font={font} isDark={isDark}
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: T.headerBg, borderBottom: `1px solid ${T.border}`,
        padding: 'clamp(24px,4vw,40px) clamp(18px,5vw,48px) 0',
      }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: T.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 16px ${T.accentGlow}`,
              }}>
                <Clapperboard size={22} color="#fff" />
              </div>
              <div>
                <h1 style={{
                  fontSize: 'clamp(20px,3.5vw,32px)', fontWeight: 800, color: T.text,
                  letterSpacing: -0.8, margin: '0 0 3px', fontFamily: font,
                }}>Browse Movies</h1>
                <p style={{ fontSize: 13, color: T.sub, margin: 0 }}>
                  {total > 0
                    ? `${total.toLocaleString()} titles · ${genreMeta.label}`
                    : 'Explore movies by genre'}
                </p>
              </div>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 12,
                  background: T.surface, border: `1px solid ${T.border}`,
                  color: T.sub, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: font, transition: 'all 0.15s',
                }}
              >
                <Search size={14} color={T.muted} />
                <span className="browse-search-label">Search</span>
                <kbd style={{
                  fontSize: 10, color: T.muted,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${T.border}`,
                  borderRadius: 5, padding: '1px 6px', fontFamily: 'monospace',
                }}>⌘K</kbd>
              </button>

              {/* View toggle */}
              <div style={{
                display: 'flex', background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 12, overflow: 'hidden',
              }}>
                {([
                  { v: 'grid', Icon: LayoutGrid, label: 'Grid' },
                  { v: 'list', Icon: List, label: 'List' },
                ] as const).map(({ v, Icon, label }) => (
                  <button key={v} onClick={() => setView(v)} style={{
                    padding: '9px 16px', border: 'none', cursor: 'pointer',
                    background: view === v ? T.accent : 'transparent',
                    color: view === v ? '#fff' : T.sub,
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 600, fontFamily: font, transition: 'all 0.15s',
                  }}>
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Genre tabs */}
          <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' } as React.CSSProperties}>
            {GENRES.map(({ key, label, color }) => {
              const active = activeGenre === key;
              return (
                <button key={key} onClick={() => setActiveGenre(key)} style={{
                  padding: '12px 18px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? color : T.muted,
                  borderBottom: `2.5px solid ${active ? color : 'transparent'}`,
                  whiteSpace: 'nowrap', flexShrink: 0, fontFamily: font, transition: 'color 0.15s',
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main style={{
        maxWidth: 1240, margin: '0 auto',
        padding: 'clamp(20px,4vw,40px) clamp(18px,5vw,48px)',
      }}>

        {/* Grid view */}
        {view === 'grid' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))',
            gap: 20,
          }}>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <SkeletonLoader width="100%" height={200} borderRadius={12} />
                    <SkeletonLoader width="75%" height={12} borderRadius={4} />
                    <SkeletonLoader width="50%" height={10} borderRadius={4} />
                  </div>
                ))
              : movies.map((movie) => {
                  const hov = hoveredId === movie.id;
                  return (
                    <button key={movie.id} onClick={() => handlePress(movie)}
                      onMouseEnter={() => setHoveredId(movie.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                      <div style={{
                        width: '100%', aspectRatio: '2/3', borderRadius: 12,
                        overflow: 'hidden', backgroundColor: T.card,
                        border: `1px solid ${hov ? genreMeta.color + '70' : T.border}`,
                        marginBottom: 9, position: 'relative',
                        transform: hov ? 'translateY(-5px) scale(1.01)' : 'none',
                        boxShadow: hov
                          ? `0 16px 36px rgba(0,0,0,0.3), 0 0 0 1px ${genreMeta.color}40`
                          : '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        <img src={getPosterUrl(movie.poster_path, 'w342')} alt={movie.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                        }} />
                        {hov && (
                          <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%', background: T.accent,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                                <polygon points="5,3 19,12 5,21" />
                              </svg>
                            </div>
                          </div>
                        )}
                        {(movie.vote_average ?? 0) > 0 && (
                          <div style={{
                            position: 'absolute', top: 7, left: 7,
                            display: 'flex', alignItems: 'center', gap: 3,
                            background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '2px 6px',
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: T.accentGold }}>
                              {movie.vote_average!.toFixed(1)}
                            </span>
                          </div>
                        )}
                        {movie.release_year && (
                          <span style={{
                            position: 'absolute', bottom: 7, left: 7,
                            fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.75)',
                          }}>{movie.release_year}</span>
                        )}
                      </div>
                      <p style={{
                        fontSize: 12.5, fontWeight: 700, color: T.text, margin: '0 0 3px',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        fontFamily: font, lineHeight: 1.35,
                      } as React.CSSProperties}>{movie.title}</p>
                      {movie.director && (
                        <p style={{
                          fontSize: 11, color: T.muted, margin: 0,
                          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}>{movie.director}</p>
                      )}
                    </button>
                  );
                })
            }
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonLoader key={i} width="100%" height={100} borderRadius={14} />
                ))
              : movies.map((movie) => {
                  const hov = hoveredId === movie.id;
                  return (
                    <button key={movie.id} onClick={() => handlePress(movie)}
                      onMouseEnter={() => setHoveredId(movie.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        background: hov
                          ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                          : T.surface,
                        border: `1px solid ${hov ? genreMeta.color + '60' : T.border}`,
                        borderRadius: 14, padding: '12px 16px',
                        cursor: 'pointer', textAlign: 'left',
                        transform: hov ? 'translateX(5px)' : 'none',
                        boxShadow: hov
                          ? `0 6px 24px rgba(0,0,0,0.14), 0 0 0 1px ${genreMeta.color}30`
                          : 'none',
                        transition: 'all 0.18s ease',
                      }}>
                      <div style={{
                        width: 3, alignSelf: 'stretch', borderRadius: 2,
                        backgroundColor: hov ? genreMeta.color : T.muted,
                        flexShrink: 0, transition: 'background 0.15s',
                      }} />
                      <div style={{
                        width: 56, height: 80, borderRadius: 9, overflow: 'hidden',
                        flexShrink: 0, background: T.card, boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
                      }}>
                        <img src={getPosterUrl(movie.poster_path, 'w185')} alt={movie.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 14, fontWeight: 700, color: T.text, margin: '0 0 3px',
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          fontFamily: font, lineHeight: 1.35,
                        } as React.CSSProperties}>{movie.title}</p>
                        {movie.director && (
                          <p style={{ fontSize: 12, color: T.sub, margin: '0 0 7px' }}>{movie.director}</p>
                        )}
                        {movie.release_year && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: genreMeta.color,
                            background: genreMeta.color + '1E', borderRadius: 6, padding: '2px 9px',
                          }}>{movie.release_year}</span>
                        )}
                      </div>
                      {(movie.vote_average ?? 0) > 0 && (
                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 2,
                          background: 'rgba(226,185,111,0.1)',
                          border: '1px solid rgba(226,185,111,0.2)',
                          borderRadius: 10, padding: '6px 12px', flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: T.accentGold, lineHeight: 1 }}>
                            {movie.vote_average!.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
            }
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, marginTop: 44, flexWrap: 'wrap',
          }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px',
                borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface,
                color: page === 1 ? T.muted : T.text,
                cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600,
                opacity: page === 1 ? 0.4 : 1, fontFamily: font, transition: 'all 0.15s',
              }}>
              <ChevronLeft size={15} /> Prev
            </button>
            <div style={{ display: 'flex', gap: 5 }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                const active = p === page;
                return (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 36, height: 36, borderRadius: 9,
                    border: `1px solid ${active ? T.accent : T.border}`,
                    background: active ? T.accent : T.surface,
                    color: active ? '#fff' : T.sub, cursor: 'pointer', fontSize: 13,
                    fontWeight: active ? 700 : 500, fontFamily: font,
                    boxShadow: active ? `0 4px 14px ${T.accentGlow}` : 'none',
                    transition: 'all 0.15s',
                  }}>{p}</button>
                );
              })}
            </div>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 16px',
                borderRadius: 10, border: `1px solid ${T.border}`, background: T.surface,
                color: page === totalPages ? T.muted : T.text,
                cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600,
                opacity: page === totalPages ? 0.4 : 1, fontFamily: font, transition: 'all 0.15s',
              }}>
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes cin-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cin-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
        }
        ::-webkit-scrollbar { display: none; }
        @media (max-width: 500px) { .browse-search-label { display: none; } }
      `}</style>
    </div>
  );
}
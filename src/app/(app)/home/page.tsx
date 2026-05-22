'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Globe, Zap, Clapperboard, RefreshCw,
  Play, Star, TrendingUp, Sparkles, Award, User, X, ChevronRight,
} from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { useAuthStore } from '@/store/useAuthStore';
import SkeletonLoader from '@/components/SkeletonLoader';
import { getGreeting } from '@/utils/helpers';
import { useTheme } from '@/hooks/useTheme';
import { Movie } from '@/types';
import { getPosterUrl, searchMovies } from '@/services/movieService';

/* ─── Section config ───────────────────────────────────────────────────────── */
const SECTIONS = [
  { key: 'trending',    title: 'Trending Now',     subtitle: 'Most-watched this week',  Icon: TrendingUp, color: '#F43F5E' },
  { key: 'newReleases', title: 'New Releases',      subtitle: 'Fresh in theaters',       Icon: Sparkles,   color: '#E8A020' },
  { key: 'popular',     title: 'All-Time Classics', subtitle: 'Timeless cinema',         Icon: Award,      color: '#8B5CF6' },
] as const;

const TRENDING_SEARCHES = ['Dune', 'Nolan', 'Horror 2024', 'Anime', 'Tarantino', 'A24'];

/* ─── Command Palette ──────────────────────────────────────────────────────── */
function CommandPalette({
  open, onClose, onSelect, T, font, isDark,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (m: Movie) => void;
  T: Record<string, string>;
  font: string;
  isDark: boolean;
}) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Movie[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [activeIdx, setActive]  = useState(0);
  const inputRef                = useRef<HTMLInputElement>(null);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) onClose(); // toggle handled by parent
      }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Arrow key navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && results[activeIdx]) {
        onSelect(results[activeIdx]);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, activeIdx, onSelect, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const movies = await searchMovies(query.trim());
        setResults(movies.slice(0, 8));
        setActive(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: isDark ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          animation: 'cin-fade-in 0.15s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '12vh',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(640px, calc(100vw - 32px))',
        background: isDark ? '#18172a' : '#fff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: 18,
        boxShadow: isDark
          ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(108,99,255,0.2)'
          : '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(108,99,255,0.12)',
        zIndex: 201,
        overflow: 'hidden',
        animation: 'cin-slide-up 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* Input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 18px',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        }}>
          <Search size={18} color={T.muted} style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, directors..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              background: 'transparent',
              fontSize: 16, fontWeight: 500,
              color: T.text, fontFamily: font,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                width: 22, height: 22, borderRadius: 6,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={12} color={T.muted} />
            </button>
          )}
          <kbd style={{
            fontSize: 11, color: T.muted,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 6, padding: '3px 8px',
            fontFamily: 'monospace', flexShrink: 0,
          }}>
            ESC
          </kbd>
        </div>

        {/* Body */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>

          {/* Trending chips — shown when no query */}
          {!query && (
            <div style={{ padding: '14px 18px 16px' }}>
              <p style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: T.muted, margin: '0 0 10px',
              }}>
                Trending Searches
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {TRENDING_SEARCHES.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{
                      padding: '6px 14px', borderRadius: 20,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                      color: T.sub, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: font,
                      transition: 'all 0.13s',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div style={{ padding: '10px 18px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SkeletonLoader width={40} height={56} borderRadius={8} />
                  <div style={{ flex: 1 }}>
                    <SkeletonLoader width="60%" height={12} borderRadius={4} />
                    <div style={{ marginTop: 6 }}>
                      <SkeletonLoader width="40%" height={10} borderRadius={4} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <div style={{ padding: '8px 10px' }}>
              <p style={{
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: T.muted, margin: '6px 8px 8px',
              }}>
                {results.length} results
              </p>
              {results.map((movie, idx) => {
                const active = idx === activeIdx;
                return (
                  <button
                    key={movie.id}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => { onSelect(movie); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', padding: '9px 10px', borderRadius: 10,
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      background: active
                        ? isDark ? 'rgba(108,99,255,0.14)' : 'rgba(108,99,255,0.08)'
                        : 'transparent',
                      transition: 'background 0.1s',
                      fontFamily: font,
                    }}
                  >
                    {/* Poster */}
                    <div style={{
                      width: 40, height: 56, borderRadius: 8,
                      overflow: 'hidden', flexShrink: 0,
                      background: isDark ? '#2a2840' : '#EDEAF4',
                    }}>
                      <img
                        src={getPosterUrl(movie.poster_path, 'w185')}
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: 700, color: T.text,
                        margin: '0 0 3px', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {movie.title}
                      </p>
                      <p style={{
                        fontSize: 11, color: T.sub, margin: '0 0 5px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {movie.director ?? 'Unknown Director'}
                      </p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {movie.release_year && (
                          <span style={{
                            fontSize: 10, fontWeight: 700,
                            color: '#926b1a',
                            background: 'rgba(226,185,111,0.15)',
                            borderRadius: 5, padding: '1px 7px',
                          }}>
                            {movie.release_year}
                          </span>
                        )}
                        {movie.genres?.[0] && (
                          <span style={{
                            fontSize: 10, fontWeight: 700,
                            color: '#4f46e5',
                            background: 'rgba(108,99,255,0.1)',
                            borderRadius: 5, padding: '1px 7px',
                          }}>
                            {typeof movie.genres[0] === 'string'
                              ? movie.genres[0]
                              : (movie.genres[0] as any).name}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={14} color={active ? '#6c63ff' : T.muted} style={{ flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && query && results.length === 0 && (
            <div style={{ padding: '32px 18px', textAlign: 'center' }}>
              <Search size={32} color={T.muted} style={{ opacity: 0.3, marginBottom: 10 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: '0 0 4px' }}>
                No results found
              </p>
              <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                Try a different title or director
              </p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 18px',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          display: 'flex', gap: 14,
        }}>
          {[
            { key: '', label: 'to select' },
            { key: '↑↓', label: 'to navigate' },
            { key: 'ESC', label: 'to close' },
          ].map(({ key, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {key && (
                <kbd style={{
                  fontSize: 10, color: T.muted,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 4, padding: '1px 6px', fontFamily: 'monospace',
                }}>
                  {key}
                </kbd>
              )}
              {!key && (
                <kbd style={{
                  fontSize: 10, color: T.muted,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 4, padding: '1px 6px', fontFamily: 'monospace',
                }}>
                  ↵
                </kbd>
              )}
              <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Section Row ──────────────────────────────────────────────────────────── */
function SectionRow({
  title, subtitle, Icon, accentColor, movies, isLoading, onPress, T, font,
}: {
  title: string; subtitle: string; Icon: React.ElementType;
  accentColor: string; movies: Movie[]; isLoading: boolean;
  onPress: (m: Movie) => void;
  T: Record<string, string>; font: string;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 clamp(18px,5vw,48px)', marginBottom: 18,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: accentColor + '1A',
          border: `1px solid ${accentColor}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={16} color={accentColor} />
        </div>
        <div>
          <h2 style={{
            fontSize: 15, fontWeight: 700, color: T.text,
            margin: 0, letterSpacing: -0.3, fontFamily: font,
          }}>
            {title}
          </h2>
          <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>{subtitle}</p>
        </div>
      </div>

      <div style={{
        display: 'flex', overflowX: 'auto', gap: 14,
        padding: `0 clamp(18px,5vw,48px) 16px`,
        scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
      } as React.CSSProperties}>
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, scrollSnapAlign: 'start' }}>
                <SkeletonLoader width={112} height={162} borderRadius={12} />
                <div style={{ marginTop: 8 }}>
                  <SkeletonLoader width={90} height={11} borderRadius={4} />
                  <div style={{ marginTop: 5 }}>
                    <SkeletonLoader width={60} height={10} borderRadius={4} />
                  </div>
                </div>
              </div>
            ))
          : movies.map((movie) => {
              const hov = hoveredId === movie.id;
              return (
                <div
                  key={movie.id}
                  style={{ flexShrink: 0, scrollSnapAlign: 'start', width: 112, cursor: 'pointer' }}
                  onClick={() => onPress(movie)}
                  onMouseEnter={() => setHoveredId(movie.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div style={{
                    width: 112, height: 162, borderRadius: 12, overflow: 'hidden',
                    border: `1px solid ${hov ? accentColor + '60' : T.border}`,
                    background: T.card, marginBottom: 9, position: 'relative',
                    transform: hov ? 'translateY(-4px) scale(1.02)' : 'none',
                    boxShadow: hov
                      ? `0 14px 32px rgba(0,0,0,0.28), 0 0 0 1px ${accentColor}35`
                      : '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                  }}>
                    <img
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }} />
                    {(movie.vote_average ?? 0) > 0 && (
                      <div style={{
                        position: 'absolute', bottom: 7, left: 7,
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        background: 'rgba(0,0,0,0.62)', borderRadius: 6, padding: '2px 6px',
                        backdropFilter: 'blur(4px)',
                      }}>
                        <Star size={9} fill="#E8A020" color="#E8A020" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
                          {movie.vote_average!.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {hov && (
                      <div style={{
                        position: 'absolute', top: 7, right: 7,
                        width: 26, height: 26, borderRadius: '50%', background: accentColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 14px ${accentColor}88`,
                      }}>
                        <Play size={10} color="#fff" fill="#fff" style={{ marginLeft: 1 }} />
                      </div>
                    )}
                  </div>
                  <p style={{
                    fontSize: 12, fontWeight: 700, color: T.text,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    margin: 0, fontFamily: font,
                  }}>
                    {movie.title}
                  </p>
                  <p style={{ fontSize: 11, color: T.muted, margin: '3px 0 0' }}>
                    {movie.release_year ?? '—'}
                  </p>
                </div>
              );
            })
        }
      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user }   = useAuthStore();
  const router     = useRouter();
  const { isDark } = useTheme();
  const {
    trending, newReleases, popular,
    isTrendingLoading, isNewLoading, isPopularLoading,
    fetchAll, refreshAll, isRefreshing, setSelectedMovie,
  } = useMovieStore();

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handlePress = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  }, [router, setSelectedMovie]);

  const hero = trending[0];

  /* ── Tokens ────────────────────────────────────────────────────────────── */
  const T = {
    bg:         isDark ? '#0C0B14' : '#F7F5F0',
    surface:    isDark ? '#141320' : '#FFFFFF',
    card:       isDark ? '#1C1A2E' : '#EDEAF4',
    border:     isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text:       isDark ? '#EDE9F8' : '#1A1625',
    sub:        isDark ? '#9490B0' : '#6B6580',
    muted:      isDark ? '#524F6A' : '#A09BB5',
    accent:     '#E8A020',
    accentGlow: isDark ? 'rgba(232,160,32,0.18)' : 'rgba(232,160,32,0.13)',
    navBg:      isDark ? 'rgba(12,11,20,0.88)' : 'rgba(247,245,240,0.88)',
    heroGrad:   isDark
      ? 'linear-gradient(160deg, #1a1030 0%, #0d1a30 55%, #0C0B14 100%)'
      : 'linear-gradient(160deg, #DDD5F0 0%, #D8E8F5 55%, #F7F5F0 100%)',
  };

  const font = "'Outfit', 'DM Sans', -apple-system, sans-serif";

  const sectionData = {
    trending:    { movies: trending,    isLoading: isTrendingLoading },
    newReleases: { movies: newReleases, isLoading: isNewLoading      },
    popular:     { movies: popular,     isLoading: isPopularLoading  },
  };

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, fontFamily: font, color: T.text }}>

      {/* ── Command Palette ───────────────────────────────────────────────── */}
      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(movie) => { handlePress(movie); setSearchOpen(false); }}
        T={T}
        font={font}
        isDark={isDark}
      />

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: T.navBg,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: `1px solid ${T.border}`,
      } as React.CSSProperties}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 clamp(18px,5vw,48px)',
          height: 62,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: T.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 14px ${T.accentGlow}`,
            }}>
              <Clapperboard size={17} color="#fff" />
            </div>
            <span style={{
              fontSize: 16, fontWeight: 800, color: T.text,
              letterSpacing: -0.6, fontFamily: font,
            }}>
              CineExplorer
            </span>
          </div>

          {/* Search bar — desktop: opens Command Palette */}
          <button
            onClick={() => setSearchOpen(true)}
            className="search-bar-desktop"
            style={{
              flex: 1, maxWidth: 460,
              display: 'flex', alignItems: 'center', gap: 10,
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: '9px 14px',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
          >
            <Search size={15} color={T.muted} />
            <span style={{ fontSize: 13, color: T.muted, flex: 1, textAlign: 'left' }}>
              Search movies, directors...
            </span>
            <span style={{
              fontSize: 11, color: T.muted, background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 6, padding: '2px 7px', fontFamily: 'monospace',
            }}>
              ⌘K
            </span>
          </button>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            {/* Mobile search icon */}
            <button
              className="search-btn-mobile"
              onClick={() => setSearchOpen(true)}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: T.surface, border: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <Search size={17} color={T.text} />
            </button>

            {/* Avatar */}
            {user?.image ? (
              <img
                src={user.image}
                alt={user.firstName}
                onClick={() => router.push('/settings')}
                style={{
                  width: 34, height: 34, borderRadius: '50%', objectFit: 'cover',
                  border: `2px solid ${T.accent}`, cursor: 'pointer',
                  boxShadow: `0 0 0 3px ${T.accentGlow}`,
                }}
              />
            ) : (
              <button
                onClick={() => router.push('/settings')}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: T.card, border: `1px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <User size={16} color={T.muted} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {hero && !isTrendingLoading && (
        <div style={{ background: T.heroGrad, borderBottom: `1px solid ${T.border}` }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            padding: 'clamp(28px,5vw,56px) clamp(18px,5vw,48px)',
            display: 'flex', alignItems: 'center',
            gap: 'clamp(24px,5vw,56px)', flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: isDark ? 'rgba(244,63,94,0.12)' : 'rgba(244,63,94,0.09)',
                border: '1px solid rgba(244,63,94,0.28)',
                borderRadius: 20, padding: '5px 14px', marginBottom: 20,
              }}>
                <TrendingUp size={13} color="#F43F5E" />
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#F43F5E',
                  letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: font,
                }}>
                  Trending right now
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: T.text,
                letterSpacing: -1, lineHeight: 1.12, margin: '0 0 10px', fontFamily: font,
              }}>
                {hero.title}
              </h1>

              <p style={{ fontSize: 14, color: T.sub, margin: '0 0 26px' }}>
                {hero.director}{hero.release_year ? ` · ${hero.release_year}` : ''}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={() => handlePress(hero)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: T.accent, color: '#fff', border: 'none',
                    borderRadius: 12, padding: '11px 24px',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: font, boxShadow: `0 6px 20px ${T.accentGlow}`,
                  }}
                >
                  <Play size={14} fill="#fff" color="#fff" />
                  View Movie
                </button>

                {(hero.vote_average ?? 0) > 0 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 12, padding: '10px 16px',
                  }}>
                    <Star size={14} fill={T.accent} color={T.accent} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: font }}>
                      {hero.vote_average!.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Poster stack */}
            <div style={{
              position: 'relative', flexShrink: 0,
              width: 'clamp(140px,22vw,210px)', height: 'clamp(200px,32vw,294px)',
            }}>
              {trending.slice(1, 3).map((m, i) => (
                <div key={m.id} style={{
                  position: 'absolute', width: '72%', height: '72%',
                  borderRadius: 14, overflow: 'hidden',
                  opacity: 0.38 - i * 0.1,
                  transform: `rotate(${(i + 1) * 5}deg) translateY(${i * 8}px)`,
                  right: -(i + 1) * 10, top: (i + 1) * 10,
                  border: `1px solid ${T.border}`,
                }}>
                  <img src={getPosterUrl(m.poster_path, 'w185')} alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              <div style={{
                position: 'relative', zIndex: 3,
                width: '72%', height: '72%', borderRadius: 14, overflow: 'hidden',
                boxShadow: isDark ? '0 20px 56px rgba(0,0,0,0.6)' : '0 20px 56px rgba(0,0,0,0.2)',
                border: `1px solid ${T.border}`,
              }}>
                <img src={getPosterUrl(hero.poster_path, 'w342')} alt={hero.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0 56px' }}>

        {/* Greeting row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 14, marginBottom: 36,
          padding: `0 clamp(18px,5vw,48px)`,
        }}>
          <div>
            <h2 style={{
              fontSize: 18, fontWeight: 700, color: T.text, margin: 0,
              letterSpacing: -0.3, fontFamily: font,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {getGreeting()}, {user?.firstName ?? 'Cinephile'}
              <User size={18} color={T.accent} />
            </h2>
            <p style={{ fontSize: 13, color: T.sub, margin: '4px 0 0' }}>
              What will you watch today?
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { Icon: Clapperboard, label: 'TMDB' },
              { Icon: Globe, label: 'Live data' },
              { Icon: Zap, label: 'Millions of titles' },
            ].map(({ Icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 20, padding: '5px 12px',
                fontSize: 11, fontWeight: 600, color: T.sub,
              }}>
                <Icon size={13} color={T.accent} />
                {label}
              </div>
            ))}

            <button
              onClick={refreshAll}
              disabled={isRefreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: `1px solid ${T.border}`,
                borderRadius: 20, padding: '5px 13px', cursor: 'pointer',
                opacity: isRefreshing ? 0.5 : 1, color: T.sub,
                fontSize: 11, fontWeight: 600, fontFamily: font, transition: 'border-color 0.15s',
              }}
            >
              <RefreshCw
                size={12}
                style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' } as React.CSSProperties}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Sections */}
        {SECTIONS.map(({ key, title, subtitle, Icon, color }) => {
          const { movies, isLoading } = sectionData[key];
          return (
            <SectionRow
              key={key}
              title={title}
              subtitle={subtitle}
              Icon={Icon}
              accentColor={color}
              movies={movies}
              isLoading={isLoading}
              onPress={handlePress}
              T={T}
              font={font}
            />
          );
        })}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cin-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cin-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1); }
        }
        ::-webkit-scrollbar { display: none; }
        @media (max-width: 640px)  { .search-bar-desktop { display: none !important; } }
        @media (min-width: 641px)  { .search-btn-mobile  { display: none !important; } }
      `}</style>
    </div>
  );
}
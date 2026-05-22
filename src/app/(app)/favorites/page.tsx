'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, Clock, TrendingUp, LayoutList, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useMovieStore } from '@/store/useMovieStore';
import { getPosterUrl } from '@/services/movieService';
import { useTheme } from '@/hooks/useTheme';
import { Movie } from '@/types';

type SortMode = 'all' | 'recent' | 'top';

const SORT_OPTIONS: { key: SortMode; label: string; Icon: React.ElementType }[] = [
  { key: 'all',    label: 'All',       Icon: LayoutList  },
  { key: 'recent', label: 'Recent',    Icon: Clock       },
  { key: 'top',    label: 'Top Rated', Icon: TrendingUp  },
];

export default function FavoritesPage() {
  const favorites      = useFavoritesStore((s) => s.favorites);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const setSelectedMovie = useMovieStore((s) => s.setSelectedMovie);
  const router         = useRouter();
  const { isDark }     = useTheme();

  const [sort, setSort]       = useState<SortMode>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const sorted = [...favorites].sort((a: Movie, b: Movie) => {
    if (sort === 'recent') return (b.release_year ?? 0) - (a.release_year ?? 0);
    if (sort === 'top')    return (b.vote_average ?? 0) - (a.vote_average ?? 0);
    return 0;
  });

  const handlePress = (movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  };

  /* ── Design tokens ────────────────────────────────────────────────────── */
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
    rose:       '#F43F5E',
    roseGlow:   isDark ? 'rgba(244,63,94,0.14)' : 'rgba(244,63,94,0.09)',
    headerBg:   isDark
      ? 'linear-gradient(160deg, #1a1030 0%, #0C0B14 60%)'
      : 'linear-gradient(160deg, #EDE5D8 0%, #F7F5F0 60%)',
  };

  const font = "'Outfit', 'DM Sans', -apple-system, sans-serif";

  /* ── Chip helper ────────────────────────────────────────────────────────*/
  const chipStyle = (active: boolean): React.CSSProperties => ({
    display:      'flex',
    alignItems:   'center',
    gap:          6,
    padding:      '7px 16px',
    borderRadius: 20,
    fontSize:     12,
    fontWeight:   active ? 700 : 500,
    cursor:       'pointer',
    fontFamily:   font,
    border:       `1px solid ${active ? T.accent + '55' : T.border}`,
    background:   active ? T.accentGlow : 'transparent',
    color:        active ? T.accent : T.muted,
    transition:   'all 0.15s ease',
  });

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, fontFamily: font, color: T.text }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{
        background:   T.headerBg,
        borderBottom: `1px solid ${T.border}`,
        padding:      'clamp(24px,4vw,40px) clamp(18px,5vw,48px) 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Title row */}
          <div style={{
            display:      'flex',
            alignItems:   'center',
            gap:          13,
            marginBottom: 20,
          }}>
            <div style={{
              width:          44,
              height:         44,
              borderRadius:   12,
              background:     T.rose,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      `0 4px 18px ${T.roseGlow}`,
              flexShrink:     0,
            }}>
              <Heart size={20} color="#fff" fill="#fff" />
            </div>
            <div>
              <h1 style={{
                fontSize:      'clamp(20px,3.5vw,32px)',
                fontWeight:    800,
                color:         T.text,
                letterSpacing: -0.8,
                margin:        '0 0 3px',
                fontFamily:    font,
              }}>
                Favorites
              </h1>
              <p style={{ fontSize: 13, color: T.sub, margin: 0 }}>
                {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved
              </p>
            </div>
          </div>

          {/* Sort chips */}
          <div style={{ display: 'flex', gap: 8, paddingBottom: 20 }}>
            {SORT_OPTIONS.map(({ key, label, Icon }) => (
              <button key={key} style={chipStyle(sort === key)} onClick={() => setSort(key)}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main style={{
        maxWidth: 1200,
        margin:   '0 auto',
        padding:  'clamp(20px,4vw,40px) clamp(18px,5vw,48px)',
      }}>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <div style={{
            textAlign:      'center',
            padding:        '90px 20px',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            14,
          }}>
            <div style={{
              width:          80,
              height:         80,
              borderRadius:   22,
              background:     T.surface,
              border:         `1px solid ${T.border}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      `0 4px 24px ${T.roseGlow}`,
            }}>
              <Heart size={34} color={T.muted} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>
              No favorites yet
            </p>
            <p style={{ fontSize: 13, color: T.sub, margin: 0, maxWidth: 260 }}>
              Tap the heart on any movie to save it here
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sorted.map((movie) => {
              const hov = hoveredId === movie.id;
              return (
                <div
                  key={movie.id}
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          0,
                    background:   hov
                      ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)'
                      : T.surface,
                    border:       `1px solid ${hov ? T.rose + '50' : T.border}`,
                    borderRadius: 14,
                    overflow:     'hidden',
                    transform:    hov ? 'translateX(5px)' : 'none',
                    boxShadow:    hov
                      ? `0 6px 24px ${isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
                      : 'none',
                    transition:   'all 0.18s ease',
                    cursor:       'pointer',
                  }}
                  onMouseEnter={() => setHoveredId(movie.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handlePress(movie)}
                >
                  {/* Accent bar */}
                  <div style={{
                    width:      3,
                    alignSelf:  'stretch',
                    background: hov ? T.rose : T.muted,
                    flexShrink: 0,
                    transition: 'background 0.15s',
                  }} />

                  {/* Poster */}
                  <div style={{
                    width:        58,
                    height:       82,
                    margin:       '10px 12px',
                    borderRadius: 9,
                    overflow:     'hidden',
                    flexShrink:   0,
                    background:   T.card,
                    boxShadow:    '0 3px 12px rgba(0,0,0,0.2)',
                  }}>
                    <img
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>

                  {/* Meta */}
                  <div style={{ flex: 1, minWidth: 0, padding: '12px 0' }}>
                    <p style={{
                      fontSize:        14,
                      fontWeight:      700,
                      color:           T.text,
                      margin:          '0 0 3px',
                      overflow:        'hidden',
                      textOverflow:    'ellipsis',
                      display:         '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      fontFamily:      font,
                      lineHeight:      1.35,
                    } as React.CSSProperties}>
                      {movie.title}
                    </p>

                    {movie.director && (
                      <p style={{
                        fontSize:     12,
                        color:        T.sub,
                        margin:       '0 0 7px',
                        overflow:     'hidden',
                        whiteSpace:   'nowrap',
                        textOverflow: 'ellipsis',
                      }}>
                        {movie.director}
                      </p>
                    )}

                    {movie.release_year && (
                      <span style={{
                        fontSize:     11,
                        fontWeight:   600,
                        color:        T.accent,
                        background:   T.accentGlow,
                        borderRadius: 6,
                        padding:      '2px 9px',
                        border:       `1px solid ${T.accent}28`,
                      }}>
                        {movie.release_year}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {(movie.vote_average ?? 0) > 0 && (
                    <div style={{
                      display:        'flex',
                      flexDirection:  'column',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            3,
                      background:     T.accentGlow,
                      border:         `1px solid ${T.accent}28`,
                      borderRadius:   10,
                      padding:        '6px 12px',
                      marginRight:    10,
                      flexShrink:     0,
                    }}>
                      <Star size={12} fill={T.accent} color={T.accent} />
                      <span style={{
                        fontSize:   13,
                        fontWeight: 800,
                        color:      T.accent,
                        lineHeight: 1,
                        fontFamily: font,
                      }}>
                        {movie.vote_average!.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Remove */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFavorite(movie.id); }}
                    style={{
                      width:          34,
                      height:         34,
                      borderRadius:   9,
                      marginRight:    12,
                      background:     'rgba(244,63,94,0.08)',
                      border:         '1px solid rgba(244,63,94,0.18)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      cursor:         'pointer',
                      flexShrink:     0,
                      transition:     'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.18)')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.08)')
                    }
                    aria-label="Remove from favorites"
                  >
                    <Trash2 size={14} color={T.rose} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
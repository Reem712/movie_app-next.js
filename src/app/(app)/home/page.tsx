'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Globe, Zap, Clapperboard, RefreshCw,
  Play, Star, TrendingUp, Sparkles, Award, User,
} from 'lucide-react';
import { useMovieStore } from '@/store/useMovieStore';
import { useAuthStore } from '@/store/useAuthStore';
import SkeletonLoader from '@/components/SkeletonLoader';
import { getGreeting } from '@/utils/helpers';
import { useTheme } from '@/hooks/useTheme';
import { Movie } from '@/types';
import { getPosterUrl } from '@/services/movieService';

/* ─── Section config ──────────────────────────────────────────────────────── */
const SECTIONS = [
  { key: 'trending',    title: 'Trending Now',     subtitle: 'Most-watched this week',  Icon: TrendingUp, color: '#F43F5E' },
  { key: 'newReleases', title: 'New Releases',      subtitle: 'Fresh in theaters',       Icon: Sparkles,   color: '#E8A020' },
  { key: 'popular',     title: 'All-Time Classics', subtitle: 'Timeless cinema',         Icon: Award,      color: '#8B5CF6' },
] as const;

/* ─── Section Row ─────────────────────────────────────────────────────────── */
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
      {/* Section header */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        gap:            10,
        padding:        '0 clamp(18px,5vw,48px)',
        marginBottom:   18,
      }}>
        <div style={{
          width:          34,
          height:         34,
          borderRadius:   9,
          background:     accentColor + '1A',
          border:         `1px solid ${accentColor}35`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
        }}>
          <Icon size={16} color={accentColor} />
        </div>
        <div>
          <h2 style={{
            fontSize:      15,
            fontWeight:    700,
            color:         T.text,
            margin:        0,
            letterSpacing: -0.3,
            fontFamily:    font,
          }}>
            {title}
          </h2>
          <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>{subtitle}</p>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div style={{
        display:          'flex',
        overflowX:        'auto',
        gap:              14,
        padding:          `0 clamp(18px,5vw,48px) 16px`,
        scrollSnapType:   'x mandatory',
        scrollbarWidth:   'none',
        msOverflowStyle:  'none',
      } as React.CSSProperties}>
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ flexShrink: 0, scrollSnapAlign: 'start' }}>
                <SkeletonLoader width={112} height={162} borderRadius={12} />
                <div style={{ marginTop: 8 }}>
                  <SkeletonLoader width={90}  height={11} borderRadius={4} />
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
                    width:        112,
                    height:       162,
                    borderRadius: 12,
                    overflow:     'hidden',
                    border:       `1px solid ${hov ? accentColor + '60' : T.border}`,
                    background:   T.card,
                    marginBottom: 9,
                    position:     'relative',
                    transform:    hov ? 'translateY(-4px) scale(1.02)' : 'none',
                    boxShadow:    hov
                      ? `0 14px 32px rgba(0,0,0,0.28), 0 0 0 1px ${accentColor}35`
                      : '0 2px 8px rgba(0,0,0,0.15)',
                    transition:   'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                  }}>
                    <img
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    {/* Bottom gradient */}
                    <div style={{
                      position:   'absolute',
                      bottom:     0, left: 0, right: 0,
                      height:     '45%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    }} />
                    {/* Rating badge */}
                    {(movie.vote_average ?? 0) > 0 && (
                      <div style={{
                        position:       'absolute',
                        bottom:         7, left: 7,
                        display:        'inline-flex',
                        alignItems:     'center',
                        gap:            3,
                        background:     'rgba(0,0,0,0.62)',
                        borderRadius:   6,
                        padding:        '2px 6px',
                        backdropFilter: 'blur(4px)',
                      }}>
                        <Star size={9} fill="#E8A020" color="#E8A020" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
                          {movie.vote_average!.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {/* Hover play indicator */}
                    {hov && (
                      <div style={{
                        position:       'absolute',
                        top:            7, right: 7,
                        width:          26, height: 26,
                        borderRadius:   '50%',
                        background:     accentColor,
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        boxShadow:      `0 0 14px ${accentColor}88`,
                      }}>
                        <Play size={10} color="#fff" fill="#fff" style={{ marginLeft: 1 }} />
                      </div>
                    )}
                  </div>
                  <p style={{
                    fontSize:     12,
                    fontWeight:   700,
                    color:        T.text,
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                    margin:       0,
                    fontFamily:   font,
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

/* ─── Page ────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user }   = useAuthStore();
  const router     = useRouter();
  const { isDark } = useTheme();
  const {
    trending, newReleases, popular,
    isTrendingLoading, isNewLoading, isPopularLoading,
    fetchAll, refreshAll, isRefreshing, setSelectedMovie,
  } = useMovieStore();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handlePress = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  }, [router, setSelectedMovie]);

  const hero = trending[0];

  /* ── Tokens ─────────────────────────────────────────────────────────── */
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

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header style={{
        position:          'sticky',
        top:               0,
        zIndex:            50,
        background:        T.navBg,
        backdropFilter:    'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom:      `1px solid ${T.border}`,
      } as React.CSSProperties}>
        <div style={{
          maxWidth:       1200,
          margin:         '0 auto',
          padding:        '0 clamp(18px,5vw,48px)',
          height:         62,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            16,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width:          34, height: 34,
              borderRadius:   10,
              background:     T.accent,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      `0 4px 14px ${T.accentGlow}`,
            }}>
              <Clapperboard size={17} color="#fff" />
            </div>
            <span style={{
              fontSize:      16,
              fontWeight:    800,
              color:         T.text,
              letterSpacing: -0.6,
              fontFamily:    font,
            }}>
              CineExplorer
            </span>
          </div>

          {/* Search bar — desktop */}
          <div
            onClick={() => router.push('/search')}
            className="search-bar-desktop"
            style={{
              flex:        1,
              maxWidth:    460,
              display:     'flex',
              alignItems:  'center',
              gap:         10,
              background:  T.surface,
              border:      `1px solid ${T.border}`,
              borderRadius: 12,
              padding:     '9px 14px',
              cursor:      'pointer',
              transition:  'border-color 0.15s',
            }}
          >
            <Search size={15} color={T.muted} />
            <span style={{ fontSize: 13, color: T.muted, flex: 1 }}>
              Search movies, directors…
            </span>
            <span style={{
              fontSize:     11,
              color:        T.muted,
              background:   T.card,
              border:       `1px solid ${T.border}`,
              borderRadius: 6,
              padding:      '2px 7px',
              fontFamily:   'monospace',
            }}>
              ⌘K
            </span>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <button
              className="search-btn-mobile"
              onClick={() => router.push('/search')}
              style={{
                width:          38, height: 38,
                borderRadius:   10,
                background:     T.surface,
                border:         `1px solid ${T.border}`,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                cursor:         'pointer',
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
                  width:        34, height: 34,
                  borderRadius: '50%',
                  objectFit:    'cover',
                  border:       `2px solid ${T.accent}`,
                  cursor:       'pointer',
                  boxShadow:    `0 0 0 3px ${T.accentGlow}`,
                }}
              />
            ) : (
              <button
                onClick={() => router.push('/settings')}
                style={{
                  width:          34, height: 34,
                  borderRadius:   '50%',
                  background:     T.card,
                  border:         `1px solid ${T.border}`,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  cursor:         'pointer',
                }}
              >
                <User size={16} color={T.muted} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      {hero && !isTrendingLoading && (
        <div style={{ background: T.heroGrad, borderBottom: `1px solid ${T.border}` }}>
          <div style={{
            maxWidth:   1200,
            margin:     '0 auto',
            padding:    'clamp(28px,5vw,56px) clamp(18px,5vw,48px)',
            display:    'flex',
            alignItems: 'center',
            gap:        'clamp(24px,5vw,56px)',
            flexWrap:   'wrap',
          }}>
            {/* Text */}
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              {/* Trending pill */}
              <div style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          7,
                background:   isDark ? 'rgba(244,63,94,0.12)' : 'rgba(244,63,94,0.09)',
                border:       '1px solid rgba(244,63,94,0.28)',
                borderRadius: 20,
                padding:      '5px 14px',
                marginBottom: 20,
              }}>
                <TrendingUp size={13} color="#F43F5E" />
                <span style={{
                  fontSize:      11,
                  fontWeight:    700,
                  color:         '#F43F5E',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily:    font,
                }}>
                  Trending right now
                </span>
              </div>

              <h1 style={{
                fontSize:      'clamp(26px,4vw,44px)',
                fontWeight:    800,
                color:         T.text,
                letterSpacing: -1,
                lineHeight:    1.12,
                margin:        '0 0 10px',
                fontFamily:    font,
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
                    display:      'inline-flex',
                    alignItems:   'center',
                    gap:          8,
                    background:   T.accent,
                    color:        '#fff',
                    border:       'none',
                    borderRadius: 12,
                    padding:      '11px 24px',
                    fontSize:     14,
                    fontWeight:   700,
                    cursor:       'pointer',
                    fontFamily:   font,
                    boxShadow:    `0 6px 20px ${T.accentGlow}`,
                  }}
                >
                  <Play size={14} fill="#fff" color="#fff" />
                  View Movie
                </button>

                {(hero.vote_average ?? 0) > 0 && (
                  <div style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          6,
                    background:   T.surface,
                    border:       `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding:      '10px 16px',
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
              position:   'relative',
              flexShrink: 0,
              width:      'clamp(140px,22vw,210px)',
              height:     'clamp(200px,32vw,294px)',
            }}>
              {trending.slice(1, 3).map((m, i) => (
                <div key={m.id} style={{
                  position:     'absolute',
                  width:        '72%', height: '72%',
                  borderRadius: 14,
                  overflow:     'hidden',
                  opacity:      0.38 - i * 0.1,
                  transform:    `rotate(${(i + 1) * 5}deg) translateY(${i * 8}px)`,
                  right:        -(i + 1) * 10,
                  top:          (i + 1) * 10,
                  border:       `1px solid ${T.border}`,
                }}>
                  <img
                    src={getPosterUrl(m.poster_path, 'w185')}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
              <div style={{
                position:     'relative',
                zIndex:       3,
                width:        '72%', height: '72%',
                borderRadius: 14,
                overflow:     'hidden',
                boxShadow:    isDark
                  ? '0 20px 56px rgba(0,0,0,0.6)'
                  : '0 20px 56px rgba(0,0,0,0.2)',
                border:       `1px solid ${T.border}`,
              }}>
                <img
                  src={getPosterUrl(hero.poster_path, 'w342')}
                  alt={hero.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0 56px' }}>

        {/* Greeting row */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          flexWrap:       'wrap',
          gap:            14,
          marginBottom:   36,
          padding:        `0 clamp(18px,5vw,48px)`,
        }}>
          <div>
            <h2 style={{
              fontSize:      18,
              fontWeight:    700,
              color:         T.text,
              margin:        0,
              letterSpacing: -0.3,
              fontFamily:    font,
              display:       'flex',
              alignItems:    'center',
              gap:           8,
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
              { Icon: Clapperboard, label: 'TMDB'             },
              { Icon: Globe,        label: 'Live data'         },
              { Icon: Zap,          label: 'Millions of titles'},
            ].map(({ Icon, label }) => (
              <div key={label} style={{
                display:     'flex',
                alignItems:  'center',
                gap:         5,
                background:  T.surface,
                border:      `1px solid ${T.border}`,
                borderRadius: 20,
                padding:     '5px 12px',
                fontSize:    11,
                fontWeight:  600,
                color:       T.sub,
              }}>
                <Icon size={13} color={T.accent} />
                {label}
              </div>
            ))}

            <button
              onClick={refreshAll}
              disabled={isRefreshing}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          6,
                background:   'transparent',
                border:       `1px solid ${T.border}`,
                borderRadius: 20,
                padding:      '5px 13px',
                cursor:       'pointer',
                opacity:      isRefreshing ? 0.5 : 1,
                color:        T.sub,
                fontSize:     11,
                fontWeight:   600,
                fontFamily:   font,
                transition:   'border-color 0.15s',
              }}
            >
              <RefreshCw
                size={12}
                style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' } as React.CSSProperties}
              />
              {isRefreshing ? 'Refreshing…' : 'Refresh'}
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
        ::-webkit-scrollbar { display: none; }
        @media (max-width: 640px)  { .search-bar-desktop { display: none !important; } }
        @media (min-width: 641px)  { .search-btn-mobile  { display: none !important; } }
      `}</style>
    </div>
  );
}
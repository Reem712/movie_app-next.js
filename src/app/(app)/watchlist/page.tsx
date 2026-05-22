'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Clock, CheckCircle, Bookmark, Trash2, Film } from 'lucide-react';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { useMovieStore } from '@/store/useMovieStore';
import { getPosterUrl } from '@/services/movieService';
import { Movie, WatchStatus } from '@/types';
import { useTheme } from '@/hooks/useTheme';

/* ─── Config ─────────────────────────────────────────────────────────────── */
const TABS: {
  key:   WatchStatus | 'all';
  label: string;
  Icon:  React.ElementType;
  color: string;
}[] = [
  { key: 'all',            label: 'All',      Icon: Bookmark,    color: '#E8A020' },
  { key: 'watching',       label: 'Watching', Icon: Play,        color: '#3B82F6' },
  { key: 'want-to-watch',  label: 'Want',     Icon: Clock,       color: '#F59E0B' },
  { key: 'watched',        label: 'Done',     Icon: CheckCircle, color: '#10B981' },
];

const STATUS_CFG: Record<WatchStatus, { label: string; color: string; soft: string }> = {
  'watching':      { label: 'Watching',      color: '#3B82F6', soft: 'rgba(59,130,246,0.12)'  },
  'want-to-watch': { label: 'Want to Watch', color: '#F59E0B', soft: 'rgba(245,158,11,0.12)'  },
  'watched':       { label: 'Watched',       color: '#10B981', soft: 'rgba(16,185,129,0.12)'  },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function WatchlistPage() {
  const { watchlist, updateStatus, removeFromList } = useWatchlistStore();
  const setSelectedMovie = useMovieStore((s) => s.setSelectedMovie);
  const router           = useRouter();
  const { isDark }       = useTheme();

  const [activeTab,  setActiveTab]  = useState<WatchStatus | 'all'>('all');
  const [hoveredId,  setHoveredId]  = useState<number | null>(null);

  const filtered = activeTab === 'all'
    ? watchlist
    : watchlist.filter((m) => m.status === activeTab);

  const counts = {
    all:             watchlist.length,
    watching:        watchlist.filter((m) => m.status === 'watching').length,
    'want-to-watch': watchlist.filter((m) => m.status === 'want-to-watch').length,
    watched:         watchlist.filter((m) => m.status === 'watched').length,
  };

  const progress = watchlist.length > 0
    ? Math.round((counts.watched / watchlist.length) * 100)
    : 0;

  const handlePress = (movie: Movie) => {
    setSelectedMovie(movie);
    router.push(`/movie/${movie.id}`);
  };

  /* ─── Tokens ──────────────────────────────────────────────────────────── */
  const T = {
    bg:       isDark ? '#0C0B14' : '#F7F5F0',
    surface:  isDark ? '#141320' : '#FFFFFF',
    card:     isDark ? '#1C1A2E' : '#F0EDE8',
    border:   isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.09)',
    text:     isDark ? '#EDE9F8' : '#1A1625',
    sub:      isDark ? '#9490B0' : '#6B6580',
    muted:    isDark ? '#524F6A' : '#A09BB5',
    accent:   '#E8A020',
    accentGlow: isDark ? 'rgba(232,160,32,0.18)' : 'rgba(232,160,32,0.14)',
    headerBg: isDark
      ? 'linear-gradient(160deg, #1a1030 0%, #0C0B14 60%)'
      : 'linear-gradient(160deg, #EDE5D8 0%, #F7F5F0 60%)',
  };

  const font = "'Outfit', 'DM Sans', -apple-system, sans-serif";

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, fontFamily: font, color: T.text }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{
        background:   T.headerBg,
        borderBottom: `1px solid ${T.border}`,
        padding:      'clamp(22px,4vw,38px) clamp(18px,4vw,40px) 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width:          42, height: 42, borderRadius: 12,
              background:     T.accent,
              display:        'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow:      `0 4px 16px ${T.accentGlow}`,
            }}>
              <Bookmark size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{
                fontSize:      'clamp(20px,4vw,32px)',
                fontWeight:    800,
                color:         T.text,
                letterSpacing: -0.8,
                margin:        0,
                fontFamily:    font,
              }}>
                My Watchlist
              </h1>
              <p style={{ fontSize: 13, color: T.sub, margin: 0 }}>
                {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} tracked
              </p>
            </div>
          </div>

          {/* Stats cards */}
          {watchlist.length > 0 && (
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap:                 10,
              margin:              '18px 0',
            }}>
              {[
                { label: 'Want',     count: counts['want-to-watch'], color: '#F59E0B' },
                { label: 'Watching', count: counts.watching,         color: '#3B82F6' },
                { label: 'Done',     count: counts.watched,          color: '#10B981' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{
                  background:   T.surface,
                  border:       `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding:      '10px 14px',
                  textAlign:    'center',
                }}>
                  <p style={{ fontSize: 24, fontWeight: 800, color, margin: '0 0 2px', fontFamily: font }}>
                    {count}
                  </p>
                  <p style={{
                    fontSize:        10,
                    fontWeight:      600,
                    color:           T.muted,
                    margin:          0,
                    textTransform:   'uppercase',
                    letterSpacing:   '0.06em',
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {watchlist.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                fontSize:       11,
                fontWeight:     600,
                color:          T.muted,
                marginBottom:   7,
              }}>
                <span>Watch progress</span>
                <span style={{ color: '#10B981' }}>{progress}% watched</span>
              </div>
              <div style={{
                height: 5, background: T.border,
                borderRadius: 3, overflow: 'hidden',
              }}>
                <div style={{
                  height:     '100%',
                  width:      `${progress}%`,
                  background: `linear-gradient(90deg, ${T.accent}, #10B981)`,
                  borderRadius: 3,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0,
            overflowX: 'auto', scrollbarWidth: 'none',
          } as React.CSSProperties}>
            {TABS.map(({ key, label, Icon, color }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          6,
                    padding:      '12px 15px',
                    border:       'none',
                    background:   'none',
                    cursor:       'pointer',
                    fontSize:     12,
                    fontWeight:   active ? 700 : 500,
                    color:        active ? color : T.muted,
                    borderBottom: `2.5px solid ${active ? color : 'transparent'}`,
                    whiteSpace:   'nowrap',
                    flexShrink:   0,
                    fontFamily:   font,
                    transition:   'color 0.15s',
                  }}
                >
                  <Icon size={13} />
                  {label}
                  <span style={{
                    fontSize:     10,
                    fontWeight:   700,
                    background:   active ? color + '22' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    color:        active ? color : T.muted,
                    borderRadius: 9,
                    padding:      '1px 7px',
                  }}>
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── List ──────────────────────────────────────────────────────────── */}
      <main style={{
        maxWidth: 1200,
        margin:   '0 auto',
        padding:  'clamp(18px,4vw,36px)',
      }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign:      'center',
            padding:        '80px 20px',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            14,
          }}>
            <div style={{
              width:          76, height: 76,
              borderRadius:   20,
              background:     T.surface,
              border:         `1px solid ${T.border}`,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <Film size={34} color={T.muted} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>
              Nothing here yet
            </p>
            <p style={{ fontSize: 13, color: T.sub, margin: 0 }}>
              Add movies to your watchlist from any movie page
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((entry) => {
              const cfg     = STATUS_CFG[entry.status];
              const hovered = hoveredId === entry.id;
              return (
                <div
                  key={entry.id}
                  style={{
                    background:   hovered
                      ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)'
                      : T.surface,
                    border:       `1px solid ${hovered ? cfg.color + '55' : T.border}`,
                    borderRadius: 14,
                    overflow:     'hidden',
                    display:      'flex',
                    transform:    hovered ? 'translateY(-2px)' : 'none',
                    boxShadow:    hovered ? `0 8px 28px rgba(0,0,0,0.12)` : 'none',
                    transition:   'all 0.18s ease',
                  }}
                  onMouseEnter={() => setHoveredId(entry.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Accent bar */}
                  <div style={{ width: 3, background: cfg.color, flexShrink: 0 }} />

                  {/* Poster */}
                  <button
                    onClick={() => handlePress(entry)}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', padding: 12, flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: 64, height: 92, borderRadius: 9,
                      overflow: 'hidden', background: T.card,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
                    }}>
                      <img
                        src={getPosterUrl(entry.poster_path, 'w185')}
                        alt={entry.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  </button>

                  {/* Info */}
                  <div style={{
                    flex:    1,
                    padding: '12px 14px 12px 0',
                    minWidth: 0,
                  }}>
                    <div style={{
                      display:        'flex',
                      alignItems:     'flex-start',
                      justifyContent: 'space-between',
                      gap:            8,
                      marginBottom:   6,
                    }}>
                      <div style={{ minWidth: 0 }}>
                        <button
                          onClick={() => handlePress(entry)}
                          style={{
                            background: 'none', border: 'none',
                            cursor: 'pointer', padding: 0, textAlign: 'left',
                          }}
                        >
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
                            {entry.title}
                          </p>
                        </button>
                        <p style={{ fontSize: 11, color: T.muted, margin: 0 }}>
                          {entry.director}
                          {entry.release_year ? ` · ${entry.release_year}` : ''}
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromList(entry.id)}
                        style={{
                          width:          28, height: 28,
                          borderRadius:   7,
                          background:     'rgba(239,68,68,0.08)',
                          border:         '1px solid rgba(239,68,68,0.18)',
                          display:        'flex',
                          alignItems:     'center',
                          justifyContent: 'center',
                          cursor:         'pointer',
                          color:          '#EF4444',
                          flexShrink:     0,
                          transition:     'background 0.15s',
                        }}
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Status badge */}
                    <span style={{
                      display:      'inline-block',
                      fontSize:     10,
                      fontWeight:   700,
                      background:   cfg.soft,
                      color:        cfg.color,
                      borderRadius: 6,
                      padding:      '2px 9px',
                      marginBottom: 9,
                    }}>
                      {cfg.label}
                    </span>

                    {/* Status switcher */}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {(['want-to-watch', 'watching', 'watched'] as WatchStatus[]).map((s) => {
                        const sc     = STATUS_CFG[s];
                        const active = entry.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => updateStatus(entry.id, s)}
                            style={{
                              fontSize:     10,
                              fontWeight:   600,
                              padding:      '3px 11px',
                              borderRadius: 20,
                              border:       `1px solid ${active ? sc.color + '60' : T.border}`,
                              background:   active ? sc.soft : 'transparent',
                              color:        active ? sc.color : T.muted,
                              cursor:       'pointer',
                              fontFamily:   font,
                              transition:   'all 0.15s',
                            }}
                          >
                            {s === 'want-to-watch' ? 'Want' : s === 'watching' ? 'Watching' : 'Done'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
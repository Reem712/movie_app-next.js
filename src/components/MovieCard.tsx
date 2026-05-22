'use client';

import React, { memo, useState } from 'react';
import { Heart, Calendar, Star, Play } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { Movie } from '@/types';

const getPosterUrl = (
  posterPath: string | undefined,
  size: 'w185' | 'w342' | 'w500' = 'w342'
) =>
  posterPath
    ? `https://image.tmdb.org/t/p/${size}${posterPath}`
    : '/placeholder-poster.png';

interface Props {
  movie:    Movie;
  onPress:  (movie: Movie) => void;
  variant?: 'default' | 'wide';
}

const MovieCard: React.FC<Props> = memo(({ movie, onPress, variant = 'default' }) => {
  const { colors, isDark } = useTheme();
  const isFavorite         = useFavoritesStore((s) => s.isFavorite(movie.id));
  const addFavorite        = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite     = useFavoritesStore((s) => s.removeFavorite);
  const isWide             = variant === 'wide';
  const [hovered, setHovered] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    isFavorite ? removeFavorite(movie.id) : addFavorite(movie);
  };

  // Warm amber/gold accent that works in both modes
  const accentColor   = '#F5A623';
  const accentSoft    = isDark ? 'rgba(245,166,35,0.15)' : 'rgba(245,166,35,0.12)';
  const overlayBg     = isDark ? 'rgba(10,8,20,0.82)' : 'rgba(240,235,255,0.9)';

  return (
    <button
      onClick={() => onPress(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:       isWide ? 'flex' : 'block',
        flexDirection: isWide ? 'row' : undefined,
        width:         isWide ? '100%' : 148,
        marginRight:   isWide ? 0 : 14,
        marginBottom:  isWide ? 14 : 0,
        background:    isWide
          ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
          : 'transparent',
        borderRadius:  16,
        padding:       isWide ? 12 : 0,
        border:        isWide
          ? `1px solid ${hovered ? accentColor + '55' : colors.border}`
          : 'none',
        cursor:        'pointer',
        textAlign:     'left',
        flexShrink:    0,
        boxShadow:     isWide && hovered
          ? `0 8px 28px ${isDark ? 'rgba(245,166,35,0.12)' : 'rgba(0,0,0,0.1)'}`
          : isWide ? `0 2px 8px ${colors.shadow}` : 'none',
        transition:    'all 0.2s ease',
      }}
    >
      {/* Poster */}
      <div style={{
        position:        'relative',
        width:           isWide ? 90 : 148,
        height:          isWide ? 128 : 216,
        borderRadius:    isWide ? 10 : 14,
        overflow:        'hidden',
        backgroundColor: colors.skeleton,
        flexShrink:      0,
        boxShadow:       hovered
          ? `0 12px 28px rgba(0,0,0,0.35)`
          : '0 4px 14px rgba(0,0,0,0.22)',
        transform:       !isWide && hovered ? 'translateY(-3px) scale(1.01)' : 'none',
        transition:      'all 0.22s ease',
      }}>
        <img
          src={getPosterUrl(movie.poster_path, isWide ? 'w185' : 'w342')}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />

        {/* Bottom gradient */}
        <div style={{
          position:   'absolute',
          bottom:     0, left: 0, right: 0,
          height:     '55%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }} />

        {/* Hover overlay with play button */}
        {hovered && (
          <div style={{
            position:       'absolute',
            inset:          0,
            background:     'rgba(0,0,0,0.38)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width:          38,
              height:         38,
              borderRadius:   '50%',
              background:     accentColor,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      `0 0 20px ${accentColor}88`,
            }}>
              <Play size={16} color="#000" fill="#000" style={{ marginLeft: 2 }} />
            </div>
          </div>
        )}

        {/* Heart */}
        <button
          onClick={handleFavorite}
          style={{
            position:       'absolute',
            top:            8,
            right:          8,
            background:     isFavorite ? '#FEF2F2' : 'rgba(255,255,255,0.88)',
            border:         'none',
            borderRadius:   '50%',
            width:          28,
            height:         28,
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            boxShadow:      '0 2px 8px rgba(0,0,0,0.2)',
            transition:     'transform 0.15s ease',
            zIndex:         2,
          }}
        >
          <Heart
            size={13}
            color={isFavorite ? '#EF4444' : '#555'}
            fill={isFavorite ? '#EF4444' : 'none'}
          />
        </button>

        {/* Rating badge */}
        {(movie.vote_average ?? 0) > 0 && (
          <div style={{
            position:    'absolute',
            bottom:      7,
            left:        7,
            display:     'flex',
            alignItems:  'center',
            gap:         3,
            background:  'rgba(0,0,0,0.6)',
            borderRadius: 6,
            padding:     '2px 6px',
            backdropFilter: 'blur(4px)',
          }}>
            <Star size={9} color={accentColor} fill={accentColor} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
              {movie.vote_average!.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{
        marginTop:      isWide ? 0 : 10,
        marginLeft:     isWide ? 13 : 0,
        display:        'flex',
        flexDirection:  'column',
        gap:            5,
        flex:           isWide ? 1 : undefined,
        justifyContent: isWide ? 'center' : undefined,
      }}>
        <p style={{
          fontSize:           isWide ? 14 : 12.5,
          fontWeight:         700,
          color:              colors.text,
          lineHeight:         1.35,
          letterSpacing:      -0.2,
          display:            '-webkit-box',
          WebkitLineClamp:    2,
          WebkitBoxOrient:    'vertical',
          overflow:           'hidden',
          margin:             0,
          fontFamily:         "'Outfit', sans-serif",
        }}>
          {movie.title}
        </p>

        {isWide && movie.director && (
          <p style={{
            fontSize:  12,
            color:     colors.textSecondary,
            margin:    0,
            overflow:  'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {movie.director}
          </p>
        )}

        {isWide && (movie.vote_average ?? 0) > 0 && (
          <div style={{
            display:     'flex',
            alignItems:  'center',
            gap:         4,
            background:  accentSoft,
            borderRadius: 6,
            padding:     '3px 8px',
            width:       'fit-content',
          }}>
            <Star size={11} color={accentColor} fill={accentColor} />
            <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>
              {movie.vote_average!.toFixed(1)}
            </span>
          </div>
        )}

        {movie.release_year && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={10} color={colors.textMuted} />
            <span style={{ fontSize: 11, color: colors.textMuted }}>
              {movie.release_year}
            </span>
          </div>
        )}
      </div>
    </button>
  );
});

MovieCard.displayName = 'MovieCard';
export default MovieCard;
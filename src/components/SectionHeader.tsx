'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import {
  Flame, Sparkles, Film, Tv, Heart,
  Search, Settings, Star, Trophy, LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  flame:     Flame,
  sparkles:  Sparkles,
  film:      Film,
  tv:        Tv,
  heart:     Heart,
  search:    Search,
  settings:  Settings,
  star:      Star,
  trophy:    Trophy,
};

interface Props {
  title:      string;
  subtitle?:  string;
  icon?:      string;
  iconColor?: string;
}

const SectionHeader: React.FC<Props> = ({ title, subtitle, icon, iconColor }) => {
  const { colors } = useTheme();
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <div style={{
      padding:     '0 20px 12px',
      display:     'flex',
      alignItems:  'center',
      gap:         10,
    }}>
      {Icon && <Icon size={18} color={iconColor ?? colors.primary} />}
      <div>
        <p style={{ fontSize: 17, fontWeight: 700, color: colors.text }}>{title}</p>
        {subtitle && (
          <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
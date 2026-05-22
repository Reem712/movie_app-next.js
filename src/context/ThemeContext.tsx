'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';

// ── Color Palette (same as RN) ──────────────────────────────────────────────

export const LightColors = {
  primary:       '#4F46E5',
  primarySoft:   '#EEF2FF',
  accent:        '#F59E0B',
  background:    '#F8F7F4',
  card:          '#FFFFFF',
  surface:       '#F1EFF9',
  text:          '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted:     '#9CA3AF',
  border:        '#E5E7EB',
  tabInactive:   '#9CA3AF',
  skeleton:      '#E9E9EF',
  skeletonShine: '#F5F5FA',
  error:         '#EF4444',
  success:       '#10B981',
  shadow:        'rgba(79,70,229,0.12)',
  overlay:       'rgba(0,0,0,0.45)',
};

export const DarkColors = {
  primary:       '#818CF8',
  primarySoft:   '#1E1B4B',
  accent:        '#FBBF24',
  background:    '#0F0E17',
  card:          '#1A1928',
  surface:       '#232136',
  text:          '#E8E6F0',
  textSecondary: '#A9A7C0',
  textMuted:     '#6B6A82',
  border:        '#2E2C45',
  tabInactive:   '#6B6A82',
  skeleton:      '#232136',
  skeletonShine: '#2A2840',
  error:         '#F87171',
  success:       '#34D399',
  shadow:        'rgba(0,0,0,0.5)',
  overlay:       'rgba(0,0,0,0.65)',
};

export type ColorScheme = typeof LightColors;
export type ThemeMode   = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  colors:       ColorScheme;
  themeMode:    ThemeMode;
  isDark:       boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme:  () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  colors:       LightColors,
  themeMode:    'system',
  isDark:       false,
  setThemeMode: () => {},
  toggleTheme:  () => {},
});

// ── Provider ────────────────────────────────────────────────────────────────

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
const [systemDark, setSystemDark]    = useState(
  () => typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : true
);

  // Detect system preference (replaces useColorScheme from RN)
  useEffect(() => {
  const saved = localStorage.getItem('theme-preference') as ThemeMode | null;
  if (saved) setThemeModeState(saved);
  else setThemeModeState('dark');
}, []);

  // Rehydrate saved preference (localStorage replaces AsyncStorage)
  useEffect(() => {
    const saved = localStorage.getItem('theme-preference') as ThemeMode | null;
    if (saved) setThemeModeState(saved);
  }, []);

  const isDark = themeMode === 'system' ? systemDark : themeMode === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  // Sync <html> class for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme-preference', mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(isDark ? 'light' : 'dark');
  }, [isDark, setThemeMode]);

  const value = useMemo(
    () => ({ colors, themeMode, isDark, setThemeMode, toggleTheme }),
    [colors, themeMode, isDark, setThemeMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ── Hook ────────────────────────────────────────────────────────────────────

export const useTheme = () => useContext(ThemeContext);

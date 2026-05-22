'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';

// ── Color Palette ────────────────────────────────────────────────────────────

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

// ── Provider ─────────────────────────────────────────────────────────────────

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [systemDark, setSystemDark]    = useState(false);

  // ✅ Single effect: load saved preference + listen to system changes
  useEffect(() => {
    // 1. Load saved preference
    const saved = localStorage.getItem('theme-preference') as ThemeMode | null;
    if (saved) {
      setThemeModeState(saved);
    }

    // 2. Read current system preference
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);

    // 3. Listen for system changes
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = themeMode === 'system' ? systemDark : themeMode === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  // ✅ Sync <html> class for Tailwind dark mode + CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);

    // Sync CSS variables to match current theme
    const c = isDark ? DarkColors : LightColors;
    root.style.setProperty('--primary',        c.primary);
    root.style.setProperty('--primary-soft',   c.primarySoft);
    root.style.setProperty('--accent',         c.accent);
    root.style.setProperty('--background',     c.background);
    root.style.setProperty('--card',           c.card);
    root.style.setProperty('--surface',        c.surface);
    root.style.setProperty('--text',           c.text);
    root.style.setProperty('--text-secondary', c.textSecondary);
    root.style.setProperty('--text-muted',     c.textMuted);
    root.style.setProperty('--border',         c.border);
    root.style.setProperty('--skeleton',       c.skeleton);
    root.style.setProperty('--error',          c.error);
    root.style.setProperty('--success',        c.success);
    root.style.setProperty('--shadow',         c.shadow);
    root.style.setProperty('--tab-inactive',   c.tabInactive);
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
    [colors, themeMode, isDark, setThemeMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useTheme = () => useContext(ThemeContext);
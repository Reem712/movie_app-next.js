/**
 * localStorage wrapper — replaces AsyncStorage from RN.
 * API is kept synchronous (localStorage is sync in browsers).
 */
export const storage = {
  set: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[storage.set] Failed to write key "${key}"`, e);
      return false;
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`[storage.get] Failed to read key "${key}"`, e);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[storage.remove] Failed to remove key "${key}"`, e);
    }
  },

  has: (key: string): boolean => {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },
};

export const STORAGE_KEYS = {
  THEME:           'theme-preference',
  AUTH:            'auth-storage',
  FAVORITES:       'favorites-storage',
  READING_LIST:    'reading-list-storage',
  ONBOARDING_DONE: 'onboarding-complete',
} as const;

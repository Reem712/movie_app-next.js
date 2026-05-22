import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { User } from '@/types';

// ── Cookie storage typed correctly for Zustand ───────────────────────────────
const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0`;
  },
};

interface AuthState {
  user:            User | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  error:           string | null;
  setUser:         (user: User) => void;
  logout:          () => void;
  setLoading:      (loading: boolean) => void;
  setError:        (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,

      setUser: (user: User) =>
        set({ user, isAuthenticated: true, error: null }),

      logout: () =>
        set({ user: null, isAuthenticated: false, error: null }),

      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError:   (error: string | null) => set({ error }),
    }),
    {
      name:    'auth-storage',
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user:            state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDto } from '../api/types';

interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  setAuth: (user: UserDto | null, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface ThemeState {
  theme: 'light' | 'dark' | 'warm' | 'cold' | 'green';
  setTheme: (theme: ThemeState['theme']) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

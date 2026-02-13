import { create } from 'zustand';
import { User, Session } from '@/types/auth.types';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthLoading: boolean;
  setUser: (user: User | null, session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthLoading: true,
  setUser: (user, session) => set({ user, session, isAuthLoading: false }),
  setLoading: (loading) => set({ isAuthLoading: loading }),
  logout: () => set({ user: null, session: null, isAuthLoading: false }),
}));

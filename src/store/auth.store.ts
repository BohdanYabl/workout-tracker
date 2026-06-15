import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { getSession } from '../services/auth.service';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    try {
      const session = await getSession();
      set({ session, user: session?.user ?? null, isInitialized: true });
    } catch {
      set({ session: null, user: null, isInitialized: true });
    }
  },
}));

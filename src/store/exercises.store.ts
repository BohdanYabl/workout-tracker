import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

interface ExercisesState {
  favorites: Set<string>;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useExercisesStore = create<ExercisesState>((set, get) => ({
  favorites: new Set<string>(),

  loadFavorites: async () => {
    try {
      const raw = await AsyncStorage.getItem(FAVORITES_KEY);
      const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      set({ favorites: new Set(ids) });
    } catch {
      // keep empty set on read failure
    }
  },

  toggleFavorite: async (id: string) => {
    const next = new Set(get().favorites);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    set({ favorites: next });
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
    } catch {
      // non-fatal: in-memory state is already updated
    }
  },

  isFavorite: (id: string) => get().favorites.has(id),
}));

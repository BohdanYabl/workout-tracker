import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine, RoutineExercise } from '../types';
import * as routinesService from '../services/routines.service';

const CACHE_KEY = 'cache:routines';

interface RoutinesState {
  routines: Routine[];
  isLoading: boolean;
  error: string | null;
  fetchRoutines: () => Promise<void>;
  addRoutine: (name: string, exercises: RoutineExercise[]) => Promise<void>;
  updateRoutine: (id: string, updates: Partial<Pick<Routine, 'name' | 'exercises'>>) => Promise<void>;
  removeRoutine: (id: string) => Promise<void>;
}

export const useRoutinesStore = create<RoutinesState>((set, get) => ({
  routines: [],
  isLoading: false,
  error: null,

  fetchRoutines: async () => {
    set({ isLoading: true, error: null });
    try {
      const routines = await routinesService.getRoutines();
      set({ routines, isLoading: false });
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(routines));
    } catch (err: unknown) {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          set({ routines: JSON.parse(cached) as Routine[], isLoading: false });
          return;
        }
      } catch {
        // Cache unreadable — fall through to error state
      }
      set({
        error: err instanceof Error ? err.message : 'Failed to load routines',
        isLoading: false,
      });
    }
  },

  addRoutine: async (name, exercises) => {
    set({ isLoading: true, error: null });
    try {
      const routine = await routinesService.createRoutine(name, exercises);
      set({ routines: [routine, ...get().routines], isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to create routine',
        isLoading: false,
      });
    }
  },

  updateRoutine: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await routinesService.updateRoutine(id, updates);
      set({
        routines: get().routines.map((r) => (r.id === id ? updated : r)),
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to update routine',
        isLoading: false,
      });
    }
  },

  removeRoutine: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await routinesService.deleteRoutine(id);
      set({
        routines: get().routines.filter((r) => r.id !== id),
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to delete routine',
        isLoading: false,
      });
    }
  },
}));

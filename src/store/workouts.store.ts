import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutSession } from '../types';
import * as workoutsService from '../services/workouts.service';
import { CreateWorkoutData } from '../services/workouts.service';

const CACHE_KEY = 'cache:workouts';

interface WorkoutsState {
  sessions: WorkoutSession[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  addSession: (data: CreateWorkoutData) => Promise<void>;
  removeSession: (id: string) => Promise<void>;
}

export const useWorkoutsStore = create<WorkoutsState>((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,

  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const sessions = await workoutsService.getWorkouts();
      set({ sessions, isLoading: false });
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(sessions));
    } catch (err: unknown) {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          set({ sessions: JSON.parse(cached) as WorkoutSession[], isLoading: false });
          return;
        }
      } catch {
        // Cache unreadable — fall through to error state
      }
      set({
        error: err instanceof Error ? err.message : 'Failed to load workouts',
        isLoading: false,
      });
    }
  },

  addSession: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const session = await workoutsService.createWorkout(data);
      set({ sessions: [session, ...get().sessions], isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to save workout',
        isLoading: false,
      });
    }
  },

  removeSession: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await workoutsService.deleteWorkout(id);
      set({
        sessions: get().sessions.filter((s) => s.id !== id),
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to delete workout',
        isLoading: false,
      });
    }
  },
}));

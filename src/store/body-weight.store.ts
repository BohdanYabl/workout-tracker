import { create } from 'zustand';
import type { BodyWeightEntry } from '../types';
import * as bodyWeightService from '../services/body-weight.service';
import type { CreateBodyWeightData } from '../services/body-weight.service';

interface BodyWeightState {
  entries: BodyWeightEntry[];
  isLoading: boolean;
  error: string | null;
  fetchEntries: () => Promise<void>;
  addEntry: (data: CreateBodyWeightData) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

export const useBodyWeightStore = create<BodyWeightState>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const entries = await bodyWeightService.getBodyWeightEntries();
      set({ entries, isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to load entries',
        isLoading: false,
      });
    }
  },

  addEntry: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const entry = await bodyWeightService.addBodyWeightEntry(data);
      set({ entries: [entry, ...get().entries], isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to save entry',
        isLoading: false,
      });
    }
  },

  removeEntry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await bodyWeightService.deleteBodyWeightEntry(id);
      set({ entries: get().entries.filter((e) => e.id !== id), isLoading: false });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : 'Failed to delete entry',
        isLoading: false,
      });
    }
  },
}));

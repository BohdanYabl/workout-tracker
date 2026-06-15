import { create } from 'zustand';
import { UserSettings } from '../types';
import * as settingsService from '../services/settings.service';

const DEFAULT_SETTINGS: UserSettings = {
  defaultRestSeconds: 90,
  weightUnit: 'kg',
  theme: 'dark',
  notificationsEnabled: true,
};

interface SettingsState {
  settings: UserSettings | null;
  isLoading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const settings = await settingsService.getSettings();
      set({ settings: settings ?? DEFAULT_SETTINGS, isLoading: false });
    } catch {
      // Fall back to defaults so the app is always usable.
      set({ settings: DEFAULT_SETTINGS, isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    set({ isLoading: true });
    try {
      const merged = { ...(get().settings ?? DEFAULT_SETTINGS), ...updates };
      const saved = await settingsService.upsertSettings(merged);
      set({ settings: saved, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));

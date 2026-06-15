import { create } from 'zustand';
import { isConnected as checkConnected, onConnectionChange } from '../services/network.service';

interface NetworkState {
  isConnected: boolean;
  isInitialized: boolean;
  initialize: () => () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  isInitialized: false,

  initialize: () => {
    // Fetch the current state once; subscription below handles future changes
    void checkConnected().then((connected) => {
      set({ isConnected: connected, isInitialized: true });
    });

    const unsubscribe = onConnectionChange((connected) => {
      set({ isConnected: connected, isInitialized: true });
    });

    return unsubscribe;
  },
}));

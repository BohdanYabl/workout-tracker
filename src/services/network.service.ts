import NetInfo from '@react-native-community/netinfo';

export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
}

export function onConnectionChange(callback: (connected: boolean) => void): () => void {
  return NetInfo.addEventListener((state) => {
    callback(state.isConnected ?? false);
  });
}

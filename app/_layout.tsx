import '../global.css';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { colors } from '../src/constants/theme';
import { useAuthStore } from '../src/store/auth.store';
import { useNetworkStore } from '../src/store/network.store';
import { useSettingsStore } from '../src/store/settings.store';
import { BackButton, ErrorBoundary, LoadingSpinner, OfflineBanner } from '../src/components/ui';
import { requestPermissions } from '../src/services/notifications.service';

// Configure how notifications appear while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const { session, isInitialized, initialize } = useAuthStore();
  const initializeNetwork = useNetworkStore((s) => s.initialize);
  const fetchSettings = useSettingsStore((s) => s.fetchSettings);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    void requestPermissions();
  }, []);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const unsubscribe = initializeNetwork();
    return unsubscribe;
  }, [initializeNetwork]);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuth = segments[0] === '(auth)';

    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth) {
      router.replace('/(tabs)');
    }
  }, [session, isInitialized, segments, router]);

  if (!isInitialized) {
    return (
      <SafeAreaProvider>
        <OfflineBanner />
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <OfflineBanner />
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false, headerBackTitle: '' }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="workout/active" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen
            name="workout/[id]"
            options={{
              title: 'Workout Detail',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              headerShadowVisible: false,
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen
            name="workout/summary"
            options={{
              title: 'Workout Complete',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              headerShadowVisible: false,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="routine/create"
            options={{
              title: 'New Routine',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              headerShadowVisible: false,
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen
            name="routine/edit/[id]"
            options={{
              title: 'Edit Routine',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              headerShadowVisible: false,
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen
            name="profile"
            options={{
              title: 'My Account',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              headerShadowVisible: false,
              headerLeft: () => <BackButton />,
            }}
          />
          <Stack.Screen
            name="exercise/[id]"
            options={{
              title: 'Exercise Detail',
              headerShown: true,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.textPrimary,
              headerShadowVisible: false,
              headerLeft: () => <BackButton />,
            }}
          />
        </Stack>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

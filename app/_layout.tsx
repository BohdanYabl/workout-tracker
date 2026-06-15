import '../global.css';
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../src/constants/theme';
import { useAuthStore } from '../src/store/auth.store';
import { LoadingSpinner } from '../src/components/ui';

export default function RootLayout() {
  const { session, isInitialized, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    void initialize();
  }, [initialize]);

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
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
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
          }}
        />
        <Stack.Screen
          name="exercise/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
            headerShadowVisible: false,
            title: 'Exercise Detail',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

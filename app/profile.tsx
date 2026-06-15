import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Card, Button } from '../src/components/ui';
import { signOut } from '../src/services/auth.service';
import { useAuthStore } from '../src/store/auth.store';

function formatCreatedAt(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ProfileScreen() {
  const { user, setSession } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  async function handleSignOut() {
    try {
      setIsSigningOut(true);
      setError(undefined);
      await signOut();
      setSession(null);
      router.replace('/(auth)/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign out failed. Please try again.');
      setIsSigningOut(false);
    }
  }

  if (!user) return null;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 gap-4">
      <Card className="gap-4">
        <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
          Account
        </Text>

        <View className="gap-1">
          <Text className="text-muted text-xs">Email</Text>
          <Text className="text-foreground text-base">{user.email ?? '—'}</Text>
        </View>

        <View className="w-full h-px bg-border" />

        <View className="gap-1">
          <Text className="text-muted text-xs">Member since</Text>
          <Text className="text-foreground text-base">{formatCreatedAt(user.created_at)}</Text>
        </View>

        <View className="w-full h-px bg-border" />

        <View className="gap-1">
          <Text className="text-muted text-xs">User ID</Text>
          <Text className="text-foreground text-base font-mono">
            …{user.id.slice(-8)}
          </Text>
        </View>
      </Card>

      <Card className="gap-3">
        <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
          Session
        </Text>
        <Button
          label={isSigningOut ? 'Signing out…' : 'Sign Out'}
          variant="secondary"
          onPress={handleSignOut}
          disabled={isSigningOut}
        />
        {error ? (
          <Text className="text-danger text-sm text-center">{error}</Text>
        ) : null}
      </Card>
    </ScrollView>
  );
}

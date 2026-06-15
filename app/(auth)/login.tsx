import { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Input, Button } from '../../src/components/ui';
import { signIn } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/auth.store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { setSession } = useAuthStore();

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      const { session } = await signIn(email.trim(), password);
      setSession(session);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 justify-center px-6 gap-8">
          <View className="gap-1.5">
            <Text className="text-foreground text-3xl font-bold">Welcome back</Text>
            <Text className="text-secondary text-base">Sign in to continue</Text>
          </View>

          <View className="gap-4">
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              autoComplete="email"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={error}
              autoComplete="current-password"
            />
          </View>

          <View className="gap-4">
            <Button
              label={isLoading ? 'Signing in…' : 'Sign In'}
              onPress={handleSignIn}
              disabled={isLoading}
              size="lg"
            />
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text className="text-secondary text-center text-sm">
                Don&apos;t have an account?{' '}
                <Text className="text-primary font-semibold">Register</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

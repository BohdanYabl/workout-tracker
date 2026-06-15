import { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Input, Button } from '../../src/components/ui';
import { signUp } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/auth.store';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { setSession } = useAuthStore();

  async function handleSignUp() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      const { session } = await signUp(email.trim(), password);

      if (session) {
        setSession(session);
        router.replace('/(tabs)');
      } else {
        // Email confirmation required — send user back to login with a message.
        router.replace('/(auth)/login');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
            <Text className="text-foreground text-3xl font-bold">Create account</Text>
            <Text className="text-secondary text-base">Start your fitness journey</Text>
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
              autoComplete="new-password"
            />
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              error={error}
              autoComplete="new-password"
            />
          </View>

          <View className="gap-4">
            <Button
              label={isLoading ? 'Creating account…' : 'Create Account'}
              onPress={handleSignUp}
              disabled={isLoading}
              size="lg"
            />
            <Pressable onPress={() => router.back()}>
              <Text className="text-secondary text-center text-sm">
                Already have an account?{' '}
                <Text className="text-primary font-semibold">Sign In</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Button } from '../../src/components/ui';
import { useRoutinesStore } from '../../src/store/routines.store';
import { colors } from '../../src/constants/theme';

export default function DashboardScreen() {
  const routines = useRoutinesStore((s) => s.routines);

  function handleStartWorkout() {
    if (routines.length === 0) {
      Alert.alert(
        'No Routines',
        'Create a routine first before starting a workout.',
        [{ text: 'OK' }],
      );
      return;
    }

    if (routines.length === 1) {
      router.push(`/workout/active?routineId=${routines[0].id}`);
      return;
    }

    Alert.alert(
      'Choose a Routine',
      'Which routine would you like to do today?',
      [
        ...routines.slice(0, 5).map((r) => ({
          text: r.name,
          onPress: () => router.push(`/workout/active?routineId=${r.id}`),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-4 gap-4">
        <View className="flex-row items-center justify-between pt-2">
          <View className="gap-1">
            <Text className="text-secondary text-base">Good morning,</Text>
            <Text className="text-foreground text-3xl font-bold">Athlete 💪</Text>
          </View>
          <Pressable onPress={() => router.push('/profile')} hitSlop={8}>
            <Ionicons name="person-circle-outline" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>

        <Card className="gap-3">
          <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
            This week
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1 gap-0.5">
              <Text className="text-foreground text-2xl font-bold">0</Text>
              <Text className="text-secondary text-sm">Workouts</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-foreground text-2xl font-bold">0 kg</Text>
              <Text className="text-secondary text-sm">Volume</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-primary text-2xl font-bold">0</Text>
              <Text className="text-secondary text-sm">Day streak</Text>
            </View>
          </View>
        </Card>

        <Button label="Start Workout" size="lg" onPress={handleStartWorkout} />

        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-foreground text-base font-semibold">Last Workout</Text>
            <Badge label="No data" variant="muted" />
          </View>
          <Text className="text-secondary text-sm">
            Your last workout will appear here once you log one.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

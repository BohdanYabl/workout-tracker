import { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, Button, LoadingSpinner } from '../../src/components/ui';
import { useRoutinesStore } from '../../src/store/routines.store';
import { useWorkoutsStore } from '../../src/store/workouts.store';
import { useAuthStore } from '../../src/store/auth.store';
import { getWeeklyStats, getLastWorkout } from '../../src/utils/stats.utils';
import { formatDuration, formatRelativeDate } from '../../src/utils/workout.utils';
import { colors } from '../../src/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const routines = useRoutinesStore((s) => s.routines);
  const { sessions, isLoading, fetchSessions } = useWorkoutsStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  // Derive stats — only recomputed when sessions change
  const { workoutCount, totalVolume, streak } = useMemo(
    () => getWeeklyStats(sessions),
    [sessions],
  );
  const lastWorkout = useMemo(() => getLastWorkout(sessions), [sessions]);

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

  const displayName = user?.email ?? 'Athlete';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-4 gap-4">

        {/* ── Greeting row ──────────────────────────────────────────────── */}
        <View className="flex-row items-center justify-between pt-2">
          <View className="gap-0.5 flex-1 mr-3">
            <Text className="text-secondary text-base">{getGreeting()},</Text>
            <Text className="text-foreground text-2xl font-bold" numberOfLines={1}>
              {displayName}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/profile')} hitSlop={8}>
            <Ionicons name="person-circle-outline" size={28} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* ── Data-dependent content ────────────────────────────────────── */}
        {isLoading && sessions.length === 0 ? (
          <View className="py-12">
            <LoadingSpinner />
          </View>
        ) : (
          <>
            {/* Weekly stats */}
            <Card className="gap-3">
              <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
                This week
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-1 gap-0.5">
                  <Text className="text-foreground text-2xl font-bold">{workoutCount}</Text>
                  <Text className="text-secondary text-sm">Workouts</Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="text-foreground text-2xl font-bold">{totalVolume} kg</Text>
                  <Text className="text-secondary text-sm">Volume</Text>
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="text-primary text-2xl font-bold">{streak}</Text>
                  <Text className="text-secondary text-sm">Day streak</Text>
                </View>
              </View>
            </Card>

            {/* Start workout */}
            <Button label="Start Workout" size="lg" onPress={handleStartWorkout} />

            {/* Last workout */}
            {lastWorkout === null ? (
              <Card className="gap-2">
                <Text className="text-foreground text-base font-semibold">Last Workout</Text>
                <Text className="text-secondary text-sm">
                  No workouts yet. Start your first one!
                </Text>
              </Card>
            ) : (
              <Card className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-foreground text-base font-semibold" numberOfLines={1}>
                    {lastWorkout.routineName}
                  </Text>
                  <Badge label={formatRelativeDate(lastWorkout.startedAt)} variant="muted" />
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-1 gap-0.5">
                    <Text className="text-foreground text-sm font-semibold">
                      {formatDuration(lastWorkout.durationSeconds ?? 0)}
                    </Text>
                    <Text className="text-muted text-xs">Duration</Text>
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="text-foreground text-sm font-semibold">
                      {lastWorkout.totalVolume} kg
                    </Text>
                    <Text className="text-muted text-xs">Volume</Text>
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="text-foreground text-sm font-semibold">
                      {lastWorkout.exercises.length}
                    </Text>
                    <Text className="text-muted text-xs">Exercises</Text>
                  </View>
                </View>
              </Card>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

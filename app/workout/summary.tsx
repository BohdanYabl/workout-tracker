import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../../src/components/ui';
import { useActiveWorkoutStore } from '../../src/store/active-workout.store';
import { formatDuration } from '../../src/utils/workout.utils';
import { colors } from '../../src/constants/theme';

interface StatBlockProps {
  label: string;
  value: string;
}

function StatBlock({ label, value }: StatBlockProps) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="text-foreground text-2xl font-bold">{value}</Text>
      <Text className="text-secondary text-xs">{label}</Text>
    </View>
  );
}

export default function WorkoutSummaryScreen() {
  const { completedSession, cancelWorkout } = useActiveWorkoutStore();

  if (!completedSession) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center gap-4" edges={['bottom']}>
        <Text className="text-secondary text-base">No session data available.</Text>
        <Button label="Go Home" onPress={() => router.replace('/(tabs)')} />
      </SafeAreaView>
    );
  }

  const totalSets = completedSession.exercises.reduce(
    (n, ex) => n + ex.sets.filter((s) => s.isCompleted).length,
    0,
  );
  const prCount = completedSession.exercises.reduce(
    (n, ex) => n + ex.sets.filter((s) => s.isPersonalRecord && s.isCompleted).length,
    0,
  );

  function handleDone() {
    cancelWorkout(); // clears the store so stale data doesn't show on next workout
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <View className="items-center gap-2 py-4">
          <Ionicons name="trophy-outline" size={52} color={colors.primary} />
          <Text className="text-foreground text-2xl font-bold">Workout Complete!</Text>
          <Text className="text-secondary text-sm">{completedSession.routineName}</Text>
        </View>

        {/* ── Stats grid ────────────────────────────────────────────────── */}
        <Card className="gap-4">
          <View className="flex-row gap-4">
            <StatBlock
              label="Duration"
              value={formatDuration(completedSession.durationSeconds ?? 0)}
            />
            <View className="w-px bg-border" />
            <StatBlock label="Volume" value={`${completedSession.totalVolume} kg`} />
          </View>
          <View className="h-px bg-border" />
          <View className="flex-row gap-4">
            <StatBlock
              label="Exercises"
              value={String(completedSession.exercises.length)}
            />
            <View className="w-px bg-border" />
            <StatBlock label="Sets Done" value={String(totalSets)} />
          </View>
          {prCount > 0 && (
            <>
              <View className="h-px bg-border" />
              <View className="flex-row items-center justify-center gap-2">
                <View className="bg-warning/20 rounded px-2 py-0.5">
                  <Text className="text-warning text-sm font-bold">
                    {prCount} Personal Record{prCount !== 1 ? 's' : ''} 🎉
                  </Text>
                </View>
              </View>
            </>
          )}
        </Card>

        {/* ── Exercise breakdown ────────────────────────────────────────── */}
        {completedSession.exercises.map((ex) => {
          const doneSets = ex.sets.filter((s) => s.isCompleted);
          return (
            <Card key={ex.exerciseId} className="gap-2">
              <Text className="text-foreground text-sm font-semibold">{ex.exerciseName}</Text>
              {doneSets.length === 0 ? (
                <Text className="text-muted text-xs">No sets completed</Text>
              ) : (
                doneSets.map((s) => (
                  <View key={s.setNumber} className="flex-row items-center gap-2">
                    <Text className="text-muted text-xs w-6">#{s.setNumber}</Text>
                    <Text className="text-secondary text-xs flex-1">
                      {s.weight} kg × {s.reps} reps
                    </Text>
                    {s.isPersonalRecord && (
                      <View className="bg-warning/20 rounded px-1">
                        <Text className="text-warning text-xs font-bold">PR</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </Card>
          );
        })}

        <Button label="Done" size="lg" onPress={handleDone} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Card, Badge, Button } from '../../src/components/ui';
import { useWorkoutsStore } from '../../src/store/workouts.store';
import { formatDuration, formatRelativeDate } from '../../src/utils/workout.utils';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useWorkoutsStore((s) => s.sessions.find((w) => w.id === id));
  const { removeSession } = useWorkoutsStore();

  function handleDelete() {
    Alert.alert(
      'Delete Workout',
      'Delete this workout session? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeSession(id);
            router.back();
          },
        },
      ],
    );
  }

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center gap-4" edges={['bottom']}>
        <Text className="text-foreground text-lg font-semibold">Workout not found</Text>
        <Button label="Go Back" variant="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* ── Summary ──────────────────────────────────────────────────── */}
        <Card className="gap-4">
          <View className="gap-1">
            <Text className="text-foreground text-xl font-bold">{session.routineName}</Text>
            <Text className="text-secondary text-sm">{formatRelativeDate(session.startedAt)}</Text>
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1 gap-0.5">
              <Text className="text-foreground text-base font-semibold">
                {formatDuration(session.durationSeconds ?? 0)}
              </Text>
              <Text className="text-muted text-xs">Duration</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-foreground text-base font-semibold">
                {session.totalVolume} kg
              </Text>
              <Text className="text-muted text-xs">Total volume</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="text-foreground text-base font-semibold">
                {session.exercises.length}
              </Text>
              <Text className="text-muted text-xs">Exercises</Text>
            </View>
          </View>
        </Card>

        {/* ── Exercises ─────────────────────────────────────────────────── */}
        {session.exercises.map((ex) => {
          const completedSets = ex.sets.filter((s) => s.isCompleted);
          return (
            <Card key={ex.exerciseId} className="gap-3">
              <Text className="text-foreground text-sm font-semibold">{ex.exerciseName}</Text>
              {completedSets.length === 0 ? (
                <Text className="text-muted text-xs">No sets completed</Text>
              ) : (
                completedSets.map((s) => (
                  <View key={s.setNumber} className="flex-row items-center gap-3">
                    <Text className="text-muted text-xs w-5">#{s.setNumber}</Text>
                    <Text className="text-secondary text-sm flex-1">
                      {s.weight} kg × {s.reps} reps
                    </Text>
                    {s.isPersonalRecord && <Badge label="PR" variant="warning" />}
                  </View>
                ))
              )}
            </Card>
          );
        })}

        {/* ── Delete ───────────────────────────────────────────────────── */}
        <Button label="Delete Workout" variant="secondary" onPress={handleDelete} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui';
import { useActiveWorkoutStore, ActiveSet, ActiveExercise } from '../../src/store/active-workout.store';
import { useWorkoutsStore } from '../../src/store/workouts.store';
import { useRoutinesStore } from '../../src/store/routines.store';
import { formatDuration } from '../../src/utils/workout.utils';
import { colors } from '../../src/constants/theme';
import * as hapticsService from '../../src/services/haptics.service';

// ── Sub-components (fine-grained store subscriptions to limit re-renders) ────

function ElapsedTimer() {
  const elapsedSeconds = useActiveWorkoutStore((s) => s.elapsedSeconds);
  return (
    <Text className="text-secondary text-sm font-mono">{formatDuration(elapsedSeconds)}</Text>
  );
}

function RestTimerOverlay() {
  const restSeconds = useActiveWorkoutStore((s) => s.restSeconds);
  const skipRest = useActiveWorkoutStore((s) => s.skipRest);

  // Detect natural rest-end (non-null → null transition) and trigger haptic
  const prevRef = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    if (prevRef.current !== undefined && prevRef.current !== null && restSeconds === null) {
      hapticsService.warningNotification();
    }
    prevRef.current = restSeconds;
  }, [restSeconds]);

  if (restSeconds === null) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border items-center gap-3 pt-5 pb-10 px-4">
      <Text className="text-secondary text-xs font-medium uppercase tracking-widest">Rest</Text>
      <Text className="text-foreground font-bold" style={{ fontSize: 72 }}>
        {restSeconds}
      </Text>
      <Button
        label="Skip Rest"
        variant="secondary"
        size="sm"
        onPress={() => {
          hapticsService.lightImpact();
          skipRest();
        }}
      />
    </View>
  );
}

// ── Set row ───────────────────────────────────────────────────────────────────

interface SetRowProps {
  workoutSet: ActiveSet;
  exerciseIndex: number;
  setIndex: number;
}

function SetRow({ workoutSet, exerciseIndex, setIndex }: SetRowProps) {
  const updateSet = useActiveWorkoutStore((s) => s.updateSet);
  const toggleSetComplete = useActiveWorkoutStore((s) => s.toggleSetComplete);

  return (
    <View
      className={`flex-row items-center gap-2 py-2 px-2 rounded-xl mb-1 ${
        workoutSet.isCompleted ? 'bg-primary/10' : ''
      }`}
    >
      <Text
        className={`w-6 text-center text-sm font-semibold ${
          workoutSet.isCompleted ? 'text-primary' : 'text-muted'
        }`}
      >
        {workoutSet.setNumber}
      </Text>

      <TextInput
        style={{ width: 60 }}
        className="bg-elevated border border-border rounded-lg text-foreground text-sm text-center py-2"
        keyboardType="numeric"
        value={workoutSet.weight === 0 ? '' : String(workoutSet.weight)}
        onChangeText={(t) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(t) || 0)}
        selectTextOnFocus
        editable={!workoutSet.isCompleted}
      />
      <Text className="text-muted text-xs">kg</Text>

      <TextInput
        style={{ width: 52 }}
        className="bg-elevated border border-border rounded-lg text-foreground text-sm text-center py-2"
        keyboardType="numeric"
        value={workoutSet.reps === 0 ? '' : String(workoutSet.reps)}
        onChangeText={(t) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(t, 10) || 0)}
        selectTextOnFocus
        editable={!workoutSet.isCompleted}
      />
      <Text className="text-muted text-xs">reps</Text>

      {workoutSet.isPersonalRecord && workoutSet.isCompleted && (
        <View className="bg-warning/20 rounded px-1.5 py-0.5">
          <Text className="text-warning text-xs font-bold">PR</Text>
        </View>
      )}

      <Pressable
        onPress={() => toggleSetComplete(exerciseIndex, setIndex)}
        hitSlop={6}
        className="ml-auto"
      >
        <Ionicons
          name={workoutSet.isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={28}
          color={workoutSet.isCompleted ? colors.primary : colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

// ── Exercise section ──────────────────────────────────────────────────────────

function ExerciseSection({
  exercise,
  exerciseIndex,
}: {
  exercise: ActiveExercise;
  exerciseIndex: number;
}) {
  return (
    <View className="mb-5">
      <View className="px-4 pb-2">
        <Text className="text-foreground text-base font-semibold">{exercise.exerciseName}</Text>
        <Text className="text-muted text-xs">
          {exercise.targetSets} × {exercise.targetReps} @ {exercise.targetWeight} kg
        </Text>
      </View>
      <View className="px-3">
        {exercise.sets.map((s, si) => (
          <SetRow
            key={s.setNumber}
            workoutSet={s}
            exerciseIndex={exerciseIndex}
            setIndex={si}
          />
        ))}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ActiveWorkoutScreen() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();

  const routines = useRoutinesStore((s) => s.routines);
  const { startWorkout, finishWorkout, stopElapsedTimer, isActive, routineName, exercises } =
    useActiveWorkoutStore();
  const { addSession } = useWorkoutsStore();

  useEffect(() => {
    const routine = routines.find((r) => r.id === routineId);
    if (routine && !isActive) {
      startWorkout(routine);
    }

    return () => {
      // Stop timers on unmount without cancelling the session
      stopElapsedTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFinish() {
    const completedSets = exercises.reduce(
      (n, ex) => n + ex.sets.filter((s) => s.isCompleted).length,
      0,
    );

    Alert.alert(
      'Finish Workout?',
      `${completedSets} set${completedSets !== 1 ? 's' : ''} completed. Save and close?`,
      [
        { text: 'Keep Going', style: 'cancel' },
        {
          text: 'Finish',
          onPress: async () => {
            const session = finishWorkout();
            await addSession(session);
            const saveError = useWorkoutsStore.getState().error;
            if (saveError) {
              Alert.alert('Save Failed', saveError, [{ text: 'OK' }]);
            }
            router.replace('/workout/summary');
          },
        },
      ],
    );
  }

  if (!isActive && exercises.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center gap-4" edges={['top', 'bottom']}>
        <Text className="text-foreground text-lg font-semibold">Routine not found</Text>
        <Button label="Go Back" variant="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View className="px-4 py-3 flex-row items-center gap-3 border-b border-border">
        <View className="flex-1 gap-0.5">
          <Text className="text-foreground text-lg font-bold" numberOfLines={1}>
            {routineName}
          </Text>
          <ElapsedTimer />
        </View>
        <Button label="Finish" size="sm" onPress={handleFinish} />
      </View>

      {/* ── Exercise list ─────────────────────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {exercises.map((ex, ei) => (
          <ExerciseSection key={ex.exerciseId} exercise={ex} exerciseIndex={ei} />
        ))}
      </ScrollView>

      {/* ── Rest timer overlay ────────────────────────────────────────── */}
      <RestTimerOverlay />
    </SafeAreaView>
  );
}

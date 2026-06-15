import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../../../src/components/ui';
import {
  NumericRoutineField,
  SelectedExerciseRow,
  ExercisePickerRow,
} from '../../../src/components/features/RoutineFormRows';
import { EXERCISES } from '../../../src/data/exercises';
import { useRoutinesStore } from '../../../src/store';
import { colors } from '../../../src/constants/theme';
import type { Exercise, RoutineExercise } from '../../../src/types';

export default function EditRoutineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { routines, updateRoutine, fetchRoutines } = useRoutinesStore();
  const routine = routines.find((r) => r.id === id);

  const [routineName, setRoutineName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // Pre-fill form when the routine loads or changes.
  useEffect(() => {
    if (routine) {
      setRoutineName(routine.name);
      setSelectedExercises(routine.exercises);
    }
  }, [routine]);

  // Ensure routines are in the store (handles deep-link navigation).
  useEffect(() => {
    if (routines.length === 0) {
      void fetchRoutines();
    }
  }, [fetchRoutines, routines.length]);

  const availableExercises = useMemo<Exercise[]>(() => {
    const selectedIds = new Set(selectedExercises.map((e) => e.exerciseId));
    const q = searchQuery.trim().toLowerCase();
    return EXERCISES.filter((e) => {
      if (selectedIds.has(e.id)) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [selectedExercises, searchQuery]);

  function handleAddExercise(exercise: Exercise) {
    setSelectedExercises((prev) => [
      ...prev,
      { exerciseId: exercise.id, targetSets: 3, targetReps: 10, targetWeight: 0, restSeconds: 90 },
    ]);
  }

  function handleRemoveExercise(exerciseId: string) {
    setSelectedExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  }

  function handleUpdateExercise(exerciseId: string, field: NumericRoutineField, value: number) {
    setSelectedExercises((prev) =>
      prev.map((e) => (e.exerciseId === exerciseId ? { ...e, [field]: value } : e)),
    );
  }

  async function handleUpdate() {
    const trimmedName = routineName.trim();
    if (!trimmedName) {
      setValidationError('Routine name is required.');
      return;
    }
    if (selectedExercises.length === 0) {
      setValidationError('Add at least one exercise to your routine.');
      return;
    }
    setValidationError(undefined);
    setIsSaving(true);
    await updateRoutine(id, { name: trimmedName, exercises: selectedExercises });
    setIsSaving(false);
    const storeError = useRoutinesStore.getState().error;
    if (storeError) {
      setValidationError(storeError);
    } else {
      router.back();
    }
  }

  if (!routine) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center gap-4" edges={['bottom']}>
        <Text className="text-foreground text-lg font-semibold">Routine not found</Text>
        <Button label="Go Back" variant="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const listHeader = (
    <View>
      <View className="px-4 pt-4 pb-5 border-b border-border">
        <Input
          label="Routine Name"
          value={routineName}
          onChangeText={setRoutineName}
          placeholder="e.g. Push Day"
          returnKeyType="next"
        />
      </View>

      {selectedExercises.length > 0 && (
        <View className="px-4 pt-4 pb-2 gap-3">
          <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
            Selected ({selectedExercises.length})
          </Text>
          {selectedExercises.map((entry) => (
            <SelectedExerciseRow
              key={entry.exerciseId}
              entry={entry}
              onRemove={() => handleRemoveExercise(entry.exerciseId)}
              onUpdate={(field, value) => handleUpdateExercise(entry.exerciseId, field, value)}
            />
          ))}
        </View>
      )}

      <View className="px-4 pt-4 pb-3 gap-3">
        <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
          Add Exercises ({availableExercises.length} available)
        </Text>
        <View className="flex-row items-center bg-surface rounded-xl px-3 border border-border">
          <Ionicons name="search-outline" size={16} color={colors.textMuted} />
          <TextInput
            className="flex-1 py-2.5 pl-2 text-foreground text-sm"
            placeholder="Search…"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
    </View>
  );

  const listFooter = (
    <View className="px-4 pt-4 pb-6 gap-3">
      {validationError ? (
        <Text className="text-danger text-sm text-center">{validationError}</Text>
      ) : null}
      <Button
        label={isSaving ? 'Saving…' : 'Update Routine'}
        onPress={handleUpdate}
        disabled={isSaving}
        size="lg"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={availableExercises}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          renderItem={({ item }) => (
            <ExercisePickerRow exercise={item} onAdd={() => handleAddExercise(item)} />
          )}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

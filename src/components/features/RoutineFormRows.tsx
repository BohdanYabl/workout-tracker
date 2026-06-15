import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui';
import { EXERCISES } from '../../data/exercises';
import { MUSCLE_LABELS } from './ExerciseCard';
import { colors } from '../../constants/theme';
import type { Exercise, RoutineExercise } from '../../types';

/** Numeric fields on RoutineExercise (excludes exerciseId). */
export type NumericRoutineField = Exclude<keyof RoutineExercise, 'exerciseId'>;

// ── NumberInput ───────────────────────────────────────────────────────────────

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function NumberInput({ label, value, onChange }: NumberInputProps) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Text className="text-muted text-xs text-center">{label}</Text>
      <TextInput
        className="bg-elevated border border-border rounded-lg text-foreground text-sm text-center py-2"
        keyboardType="numeric"
        value={value === 0 ? '' : String(value)}
        onChangeText={(t) => {
          const n = parseInt(t, 10);
          onChange(Number.isNaN(n) ? 0 : n);
        }}
        selectTextOnFocus
      />
    </View>
  );
}

// ── SelectedExerciseRow ───────────────────────────────────────────────────────

interface SelectedExerciseRowProps {
  entry: RoutineExercise;
  onRemove: () => void;
  onUpdate: (field: NumericRoutineField, value: number) => void;
}

export function SelectedExerciseRow({ entry, onRemove, onUpdate }: SelectedExerciseRowProps) {
  const name = EXERCISES.find((e) => e.id === entry.exerciseId)?.name ?? entry.exerciseId;

  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-2">
        <Text className="text-foreground text-sm font-semibold flex-1" numberOfLines={1}>
          {name}
        </Text>
        <Pressable onPress={onRemove} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </Pressable>
      </View>
      <View className="flex-row gap-2">
        <NumberInput
          label="Sets"
          value={entry.targetSets}
          onChange={(v) => onUpdate('targetSets', v)}
        />
        <NumberInput
          label="Reps"
          value={entry.targetReps}
          onChange={(v) => onUpdate('targetReps', v)}
        />
        <NumberInput
          label="kg"
          value={entry.targetWeight}
          onChange={(v) => onUpdate('targetWeight', v)}
        />
        <NumberInput
          label="Rest s"
          value={entry.restSeconds}
          onChange={(v) => onUpdate('restSeconds', v)}
        />
      </View>
    </Card>
  );
}

// ── ExercisePickerRow ─────────────────────────────────────────────────────────

interface ExercisePickerRowProps {
  exercise: Exercise;
  onAdd: () => void;
}

export function ExercisePickerRow({ exercise, onAdd }: ExercisePickerRowProps) {
  return (
    <Pressable
      onPress={onAdd}
      className="flex-row items-center px-4 py-3.5 border-b border-border"
    >
      <View className="flex-1 gap-0.5">
        <Text className="text-foreground text-sm font-medium">{exercise.name}</Text>
        <Text className="text-muted text-xs">{MUSCLE_LABELS[exercise.muscleGroup]}</Text>
      </View>
      <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
    </Pressable>
  );
}
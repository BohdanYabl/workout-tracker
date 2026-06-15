import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge } from '../ui';
import { colors } from '../../constants/theme';
import type { Exercise, MuscleGroup, Equipment } from '../../types';

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  biceps: 'Biceps',
  triceps: 'Triceps',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  core: 'Core',
  fullBody: 'Full Body',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  cable: 'Cable',
  kettlebell: 'Kettlebell',
};

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  isFavorite?: boolean;
}

export function ExerciseCard({ exercise, onPress, isFavorite = false }: ExerciseCardProps) {
  const visibleSecondary = exercise.secondaryMuscles.slice(0, 2);

  return (
    <Pressable onPress={onPress}>
      <Card className="gap-2.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-base font-semibold flex-1 mr-2">
            {exercise.name}
          </Text>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite ? colors.danger : colors.textMuted}
          />
        </View>
        <View className="flex-row flex-wrap gap-1.5">
          <Badge label={MUSCLE_LABELS[exercise.muscleGroup]} variant="primary" />
          <Badge label={EQUIPMENT_LABELS[exercise.equipment]} variant="muted" />
          {visibleSecondary.map((m) => (
            <Badge key={m} label={MUSCLE_LABELS[m]} variant="muted" />
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

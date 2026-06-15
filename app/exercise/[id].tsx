import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EXERCISES } from '../../src/data/exercises';
import { Card, Badge, Button } from '../../src/components/ui';
import { MUSCLE_LABELS, EQUIPMENT_LABELS } from '../../src/components/features/ExerciseCard';
import { colors } from '../../src/constants/theme';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const exercise = EXERCISES.find((e) => e.id === id);

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center gap-4" edges={['bottom']}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text className="text-foreground text-lg font-semibold">Exercise not found</Text>
        <Button label="Go Back" variant="secondary" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>

        {/* ── Name + badges ──────────────────────────────────────────────── */}
        <View style={{ gap: 10 }}>
          <Text className="text-foreground text-3xl font-bold">{exercise.name}</Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge label={MUSCLE_LABELS[exercise.muscleGroup]} variant="primary" />
            <Badge label={EQUIPMENT_LABELS[exercise.equipment]} variant="muted" />
            {exercise.secondaryMuscles.map((m) => (
              <Badge key={m} label={MUSCLE_LABELS[m]} variant="muted" />
            ))}
          </View>
        </View>

        {/* ── Description ────────────────────────────────────────────────── */}
        <Card>
          <Text className="text-secondary text-sm leading-5">{exercise.description}</Text>
        </Card>

        {/* ── Instructions ───────────────────────────────────────────────── */}
        <View style={{ gap: 12 }}>
          <Text className="text-foreground text-base font-semibold">Instructions</Text>
          {exercise.instructions.map((step, index) => (
            <View key={index} className="flex-row gap-3">
              <View className="w-6 h-6 rounded-full bg-elevated items-center justify-center flex-shrink-0 mt-0.5">
                <Text className="text-primary text-xs font-bold">{index + 1}</Text>
              </View>
              <Text className="text-secondary text-sm leading-5 flex-1">{step}</Text>
            </View>
          ))}
        </View>

        {/* ── Favourite ──────────────────────────────────────────────────── */}
        <Pressable
          onPress={() => setIsFavorite((prev) => !prev)}
          className={
            isFavorite
              ? 'flex-row items-center justify-center gap-2 rounded-xl py-3 bg-surface border border-border'
              : 'flex-row items-center justify-center gap-2 rounded-xl py-3 bg-primary'
          }
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? colors.primary : '#fff'}
          />
          <Text
            className={
              isFavorite
                ? 'text-primary font-semibold text-base'
                : 'text-white font-semibold text-base'
            }
          >
            {isFavorite ? 'Saved to Favourites' : 'Mark as Favourite'}
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

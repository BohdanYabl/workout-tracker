import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../src/components/ui';
import { ExerciseCard, MUSCLE_LABELS, EQUIPMENT_LABELS } from '../../src/components/features/ExerciseCard';
import { EXERCISES } from '../../src/data/exercises';
import { colors } from '../../src/constants/theme';
import type { MuscleGroup, Equipment, Exercise } from '../../src/types';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'quads', 'hamstrings', 'glutes', 'calves', 'core', 'fullBody',
];

const EQUIPMENT_TYPES: Equipment[] = [
  'barbell', 'dumbbell', 'machine', 'bodyweight', 'cable', 'kettlebell',
];

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={
        active
          ? 'px-3 py-1.5 rounded-full border bg-primary border-primary'
          : 'px-3 py-1.5 rounded-full border bg-surface border-border'
      }
    >
      <Text
        className={
          active ? 'text-sm font-medium text-white' : 'text-sm font-medium text-secondary'
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  const filtered = useMemo<Exercise[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return EXERCISES.filter((e) => {
      if (q && !e.name.toLowerCase().includes(q)) return false;
      if (selectedMuscle && e.muscleGroup !== selectedMuscle) return false;
      if (selectedEquipment && e.equipment !== selectedEquipment) return false;
      return true;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  function toggleMuscle(group: MuscleGroup) {
    setSelectedMuscle((prev) => (prev === group ? null : group));
  }

  function toggleEquipment(eq: Equipment) {
    setSelectedEquipment((prev) => (prev === eq ? null : eq));
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* ── Title bar ─────────────────────────────────────────────────────── */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between">
        <Text className="text-foreground text-lg font-semibold">Exercises</Text>
        <Text className="text-muted text-sm">
          {filtered.length} {filtered.length === 1 ? 'exercise' : 'exercises'}
        </Text>
      </View>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <View className="mx-4 mb-3 flex-row items-center bg-surface rounded-xl px-3 border border-border">
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          className="flex-1 py-3 pl-2 text-foreground text-base"
          placeholder="Search exercises…"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {/* ── Muscle filter ─────────────────────────────────────────────────── */}
      <View className="mb-2">
        <Text className="px-4 text-secondary text-xs font-medium uppercase tracking-widest mb-2">
          Muscle
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          <FilterChip
            label="All"
            active={selectedMuscle === null}
            onPress={() => setSelectedMuscle(null)}
          />
          {MUSCLE_GROUPS.map((group) => (
            <FilterChip
              key={group}
              label={MUSCLE_LABELS[group]}
              active={selectedMuscle === group}
              onPress={() => toggleMuscle(group)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Equipment filter ──────────────────────────────────────────────── */}
      <View className="mb-1 border-b border-border pb-3">
        <Text className="px-4 text-secondary text-xs font-medium uppercase tracking-widest mb-2">
          Equipment
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          <FilterChip
            label="All"
            active={selectedEquipment === null}
            onPress={() => setSelectedEquipment(null)}
          />
          {EQUIPMENT_TYPES.map((eq) => (
            <FilterChip
              key={eq}
              label={EQUIPMENT_LABELS[eq]}
              active={selectedEquipment === eq}
              onPress={() => toggleEquipment(eq)}
            />
          ))}
        </ScrollView>
      </View>

      {/* ── Results ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No results"
          subtitle="Try a different name, muscle group, or equipment filter."
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard
              exercise={item}
              onPress={() => router.push(`/exercise/${item.id}`)}
            />
          )}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        />
      )}
    </SafeAreaView>
  );
}

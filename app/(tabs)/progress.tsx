import { useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { EmptyState, LoadingSpinner } from '../../src/components/ui';
import { WorkoutHistoryCard } from '../../src/components/features/WorkoutHistoryCard';
import { useWorkoutsStore } from '../../src/store/workouts.store';
import { formatRelativeDate } from '../../src/utils/workout.utils';
import type { WorkoutSession } from '../../src/types';

// YYYY-MM-DD key from an ISO date string (local time) — sorts correctly as a string
function toDateKey(isoString: string): string {
  const d = new Date(isoString);
  return (
    `${d.getFullYear()}-` +
    `${String(d.getMonth() + 1).padStart(2, '0')}-` +
    `${String(d.getDate()).padStart(2, '0')}`
  );
}

type ListItem =
  | { type: 'header'; dateKey: string; label: string }
  | { type: 'session'; session: WorkoutSession };

export default function ProgressScreen() {
  const { sessions, isLoading, fetchSessions } = useWorkoutsStore();

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  // Group sessions by calendar day using reduce, then flatten into a mixed list
  const listData = useMemo<ListItem[]>(() => {
    type DateGroup = { dateKey: string; label: string; items: WorkoutSession[] };

    const grouped = sessions.reduce<Record<string, DateGroup>>((acc, s) => {
      const key = toDateKey(s.startedAt);
      if (!acc[key]) {
        acc[key] = { dateKey: key, label: formatRelativeDate(s.startedAt), items: [] };
      }
      acc[key].items.push(s);
      return acc;
    }, {});

    return Object.values(grouped)
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey)) // latest date first
      .flatMap((group): ListItem[] => [
        { type: 'header', dateKey: group.dateKey, label: group.label },
        ...group.items
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .map((session): ListItem => ({ type: 'session', session })),
      ]);
  }, [sessions]);

  function renderItem({ item }: { item: ListItem }) {
    if (item.type === 'header') {
      return (
        <View className="px-4 pt-5 pb-2">
          <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
            {item.label}
          </Text>
        </View>
      );
    }
    return (
      <View className="px-4 mb-3">
        <WorkoutHistoryCard
          session={item.session}
          onPress={() => router.push(`/workout/${item.session.id}`)}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-4 pb-2 border-b border-border">
        <Text className="text-foreground text-lg font-semibold">Recent Workouts</Text>
      </View>

      {isLoading && sessions.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) =>
            item.type === 'header' ? `h-${item.dateKey}` : item.session.id
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              icon="time-outline"
              title="No workouts yet"
              subtitle="Complete your first workout to see your history here."
            />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

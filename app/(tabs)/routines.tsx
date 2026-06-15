import { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState, Button, Card, LoadingSpinner } from '../../src/components/ui';
import { useRoutinesStore } from '../../src/store';
import type { Routine } from '../../src/types';

function RoutineCard({ routine }: { routine: Routine }) {
  const count = routine.exercises.length;
  return (
    <Card className="gap-1">
      <Text className="text-foreground text-base font-semibold">{routine.name}</Text>
      <Text className="text-secondary text-sm">
        {count} {count === 1 ? 'exercise' : 'exercises'}
      </Text>
    </Card>
  );
}

export default function RoutinesScreen() {
  const { routines, isLoading, fetchRoutines } = useRoutinesStore();

  useEffect(() => {
    void fetchRoutines();
  }, [fetchRoutines]);

  function renderBody() {
    if (isLoading) return <LoadingSpinner />;

    if (routines.length === 0) {
      return (
        <EmptyState
          icon="list-outline"
          title="No routines yet"
          subtitle="Create a routine to organise your exercises into a repeatable workout plan."
        />
      );
    }

    return (
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineCard routine={item} />}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-4 pb-3 border-b border-border flex-row items-center justify-between">
        <Text className="text-foreground text-lg font-semibold">Routines</Text>
        <Button label="+ New" variant="ghost" size="sm" />
      </View>
      {renderBody()}
    </SafeAreaView>
  );
}

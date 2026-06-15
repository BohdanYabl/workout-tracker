import { useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { EmptyState, Button, LoadingSpinner } from '../../src/components/ui';
import { RoutineListCard } from '../../src/components/features/RoutineListCard';
import { useRoutinesStore } from '../../src/store';
import type { Routine } from '../../src/types';

function confirmDelete(routine: Routine, onConfirm: () => void) {
  Alert.alert(
    'Delete Routine',
    `Delete "${routine.name}"? This cannot be undone.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onConfirm },
    ],
  );
}

export default function RoutinesScreen() {
  const { routines, isLoading, fetchRoutines, removeRoutine } = useRoutinesStore();

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
          subtitle="Create your first workout plan."
        />
      );
    }

    return (
      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoutineListCard
            routine={item}
            onPress={() => router.push(`/routine/edit/${item.id}`)}
            onDelete={() => confirmDelete(item, () => void removeRoutine(item.id))}
          />
        )}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-4 pb-3 border-b border-border flex-row items-center justify-between">
        <Text className="text-foreground text-lg font-semibold">My Routines</Text>
        <Button
          label="+ New"
          variant="ghost"
          size="sm"
          onPress={() => router.push('/routine/create')}
        />
      </View>
      {renderBody()}
    </SafeAreaView>
  );
}

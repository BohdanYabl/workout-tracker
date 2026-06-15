import { View, Text } from 'react-native';
import { EmptyState, Button } from '../../src/components/ui';

export default function RoutinesScreen() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-4 pb-3 border-b border-border flex-row items-center justify-between">
        <Text className="text-foreground text-lg font-semibold">Routines</Text>
        <Button label="+ New" variant="ghost" size="sm" />
      </View>
      <EmptyState
        icon="list-outline"
        title="No routines yet"
        subtitle="Create a routine to organise your exercises into a repeatable workout plan."
      />
    </View>
  );
}
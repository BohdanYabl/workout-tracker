import { View, Text, ScrollView } from 'react-native';
import { Card, Badge } from '../../src/components/ui';

export default function ProgressScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4"
    >
      <Text className="text-foreground text-lg font-semibold pt-2">Your Progress</Text>

      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-base font-semibold">Overall Stats</Text>
          <Badge label="All time" variant="muted" />
        </View>
        <View className="flex-row gap-4">
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-2xl font-bold">0</Text>
            <Text className="text-secondary text-sm">Total workouts</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-2xl font-bold">0 h</Text>
            <Text className="text-secondary text-sm">Total time</Text>
          </View>
        </View>
      </Card>

      <Card className="gap-3">
        <Text className="text-foreground text-base font-semibold">Personal Records</Text>
        <Text className="text-secondary text-sm">
          Complete workouts to start tracking personal records per exercise.
        </Text>
      </Card>

      <Card className="gap-3">
        <Text className="text-foreground text-base font-semibold">Body Weight</Text>
        <Text className="text-secondary text-sm">
          Log your body weight to track it over time.
        </Text>
      </Card>
    </ScrollView>
  );
}
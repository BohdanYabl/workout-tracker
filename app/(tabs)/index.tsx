import { View, Text, ScrollView } from 'react-native';
import { Card, Badge, Button } from '../../src/components/ui';

export default function DashboardScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 gap-4"
    >
      <View className="gap-1 pt-2">
        <Text className="text-secondary text-base">Good morning,</Text>
        <Text className="text-foreground text-3xl font-bold">Athlete 💪</Text>
      </View>

      <Card className="gap-3">
        <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
          This week
        </Text>
        <View className="flex-row gap-4">
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-2xl font-bold">0</Text>
            <Text className="text-secondary text-sm">Workouts</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-2xl font-bold">0 kg</Text>
            <Text className="text-secondary text-sm">Volume</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-primary text-2xl font-bold">0</Text>
            <Text className="text-secondary text-sm">Day streak</Text>
          </View>
        </View>
      </Card>

      <Button label="Start Workout" size="lg" />

      <Card className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-base font-semibold">Last Workout</Text>
          <Badge label="No data" variant="muted" />
        </View>
        <Text className="text-secondary text-sm">
          Your last workout will appear here once you log one.
        </Text>
      </Card>
    </ScrollView>
  );
}
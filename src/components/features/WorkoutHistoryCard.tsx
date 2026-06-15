import { Pressable, View, Text } from 'react-native';
import { Card } from '../ui';
import { formatDuration, formatRelativeDate } from '../../utils/workout.utils';
import type { WorkoutSession } from '../../types';

interface WorkoutHistoryCardProps {
  session: WorkoutSession;
  onPress: () => void;
}

export function WorkoutHistoryCard({ session, onPress }: WorkoutHistoryCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="gap-3">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-foreground text-base font-semibold flex-1" numberOfLines={1}>
            {session.routineName}
          </Text>
          <View className="bg-elevated rounded-full px-2.5 py-0.5">
            <Text className="text-secondary text-xs font-medium">
              {formatRelativeDate(session.startedAt)}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-sm font-semibold">
              {formatDuration(session.durationSeconds ?? 0)}
            </Text>
            <Text className="text-muted text-xs">Duration</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-sm font-semibold">
              {session.totalVolume} kg
            </Text>
            <Text className="text-muted text-xs">Volume</Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-foreground text-sm font-semibold">
              {session.exercises.length}
            </Text>
            <Text className="text-muted text-xs">Exercises</Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

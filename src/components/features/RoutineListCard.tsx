import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui';
import { formatRelativeDate } from '../../utils/workout.utils';
import { colors } from '../../constants/theme';
import type { Routine } from '../../types';

interface RoutineListCardProps {
  routine: Routine;
  onPress: () => void;
  onDelete: () => void;
}

export function RoutineListCard({ routine, onPress, onDelete }: RoutineListCardProps) {
  const count = routine.exercises.length;

  return (
    <Card>
      <View className="flex-row items-center gap-3">
        <Pressable onPress={onPress} className="flex-1 gap-1">
          <Text className="text-foreground text-base font-semibold">{routine.name}</Text>
          <Text className="text-secondary text-sm">
            {count} {count === 1 ? 'exercise' : 'exercises'} · {formatRelativeDate(routine.updatedAt)}
          </Text>
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={8} className="p-1">
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      </View>
    </Card>
  );
}
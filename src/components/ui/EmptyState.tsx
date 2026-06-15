import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon: IoniconName;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <View className="w-20 h-20 rounded-full bg-elevated items-center justify-center">
        <Ionicons name={icon} size={36} color={colors.textMuted} />
      </View>
      <Text className="text-foreground text-xl font-semibold text-center">{title}</Text>
      {subtitle ? (
        <Text className="text-secondary text-sm text-center leading-5">{subtitle}</Text>
      ) : null}
    </View>
  );
}
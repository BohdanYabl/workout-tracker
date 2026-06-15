import React from 'react';
import { View, Text } from 'react-native';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const containerVariant: Record<BadgeVariant, string> = {
  primary: 'bg-primary/20',
  success: 'bg-success/20',
  danger: 'bg-danger/20',
  warning: 'bg-warning/20',
  muted: 'bg-elevated',
};

const textVariant: Record<BadgeVariant, string> = {
  primary: 'text-primary',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  muted: 'text-secondary',
};

export function Badge({ label, variant = 'muted' }: BadgeProps) {
  return (
    <View className={`rounded-full px-2.5 py-0.5 self-start ${containerVariant[variant]}`}>
      <Text className={`text-xs font-medium ${textVariant[variant]}`}>
        {label}
      </Text>
    </View>
  );
}
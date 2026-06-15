import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
}

export function LoadingSpinner({ size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
}
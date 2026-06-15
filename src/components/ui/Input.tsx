import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-secondary text-sm font-medium">{label}</Text>
      ) : null}
      <TextInput
        className={[
          'bg-surface rounded-xl px-4 py-3 text-foreground text-base',
          'border',
          error ? 'border-danger' : 'border-border',
        ].join(' ')}
        placeholderTextColor="#525252"
        {...props}
      />
      {error ? (
        <Text className="text-danger text-xs">{error}</Text>
      ) : null}
    </View>
  );
}
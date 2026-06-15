import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-surface rounded-xl p-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
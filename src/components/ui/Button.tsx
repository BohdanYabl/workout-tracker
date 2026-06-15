import React from 'react';
import { Pressable, Text, PressableProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
}

const containerVariant: Record<Variant, string> = {
  primary: 'bg-primary active:bg-primary-dark',
  secondary: 'bg-surface border border-border',
  ghost: 'bg-transparent',
};

const textVariant: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-foreground',
  ghost: 'text-primary',
};

const containerSize: Record<Size, string> = {
  sm: 'px-3 py-2',
  md: 'px-5 py-3',
  lg: 'px-6 py-4',
};

const textSize: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={[
        'rounded-xl items-center justify-center',
        containerVariant[variant],
        containerSize[size],
        disabled ? 'opacity-40' : '',
      ].join(' ')}
      disabled={disabled}
      {...props}
    >
      <Text className={`font-semibold ${textVariant[variant]} ${textSize[size]}`}>
        {label}
      </Text>
    </Pressable>
  );
}
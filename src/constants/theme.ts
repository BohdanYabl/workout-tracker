export const colors = {
  background: '#0A0A0A',
  surface: '#161616',
  surfaceElevated: '#1F1F1F',

  primary: '#FF6B2B',
  primaryDark: '#C44E16',

  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1A1',
  textMuted: '#525252',

  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',

  border: '#2A2A2A',
  borderLight: '#383838',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
} as const;
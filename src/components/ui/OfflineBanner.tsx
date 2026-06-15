import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStore } from '../../store/network.store';
import { colors, spacing } from '../../constants/theme';

const BANNER_HEIGHT = 44;
const TAB_BAR_HEIGHT = 49;

export function OfflineBanner() {
  const { isConnected, isInitialized } = useNetworkStore();
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(BANNER_HEIGHT)).current;

  useEffect(() => {
    if (!isInitialized) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: isConnected ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: isConnected ? BANNER_HEIGHT : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isConnected, isInitialized, opacity, translateY]);

  if (!isInitialized) return null;

  const bottomOffset = insets.bottom + TAB_BAR_HEIGHT;

  return (
    <Animated.View
      style={[styles.banner, { bottom: bottomOffset, opacity, transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <Ionicons name="cloud-offline-outline" size={16} color={colors.textPrimary} />
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    height: BANNER_HEIGHT,
    backgroundColor: colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
  text: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});

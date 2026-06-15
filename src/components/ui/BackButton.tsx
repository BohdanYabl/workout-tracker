import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export function BackButton() {
  return (
    <Pressable onPress={() => router.back()} hitSlop={8} style={styles.button}>
      <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 4,
  },
});

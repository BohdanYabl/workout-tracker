import * as Haptics from 'expo-haptics';

export function lightImpact(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function mediumImpact(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function heavyImpact(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function successNotification(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function warningNotification(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function errorNotification(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

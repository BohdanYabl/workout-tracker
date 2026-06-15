import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { EmptyState, Button } from '../../src/components/ui';

export default function LibraryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-4 pt-4 pb-3 border-b border-border flex-row items-center justify-between">
        <Text className="text-foreground text-lg font-semibold">Exercises</Text>
        <Button
          label="+ Custom"
          variant="ghost"
          size="sm"
          onPress={() => router.push('/exercise/1')}
        />
      </View>
      <EmptyState
        icon="barbell-outline"
        title="No exercises yet"
        subtitle="The exercise library will be populated soon. You can also create your own custom exercises."
      />
    </SafeAreaView>
  );
}
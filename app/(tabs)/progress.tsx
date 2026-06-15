import { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { EmptyState, LoadingSpinner, Button } from '../../src/components/ui';
import { WorkoutHistoryCard } from '../../src/components/features/WorkoutHistoryCard';
import { useWorkoutsStore } from '../../src/store/workouts.store';
import { useBodyWeightStore } from '../../src/store/body-weight.store';
import { useSettingsStore } from '../../src/store/settings.store';
import { formatRelativeDate } from '../../src/utils/workout.utils';
import * as photosService from '../../src/services/photos.service';
import type { WorkoutSession, ProgressPhoto } from '../../src/types';

const PHOTO_SIZE = Math.floor((Dimensions.get('window').width - 6) / 3);

function toDateKey(isoString: string): string {
  const d = new Date(isoString);
  return (
    `${d.getFullYear()}-` +
    `${String(d.getMonth() + 1).padStart(2, '0')}-` +
    `${String(d.getDate()).padStart(2, '0')}`
  );
}

type ListItem =
  | { type: 'header'; dateKey: string; label: string }
  | { type: 'session'; session: WorkoutSession };

type Tab = 'history' | 'bodyweight' | 'photos';

const TABS: { key: Tab; label: string }[] = [
  { key: 'history', label: 'History' },
  { key: 'bodyweight', label: 'Body Weight' },
  { key: 'photos', label: 'Photos' },
];

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('history');

  // ── History ──────────────────────────────────────────────────────────────────
  const { sessions, isLoading: sessionsLoading, fetchSessions } = useWorkoutsStore();

  // ── Body weight ──────────────────────────────────────────────────────────────
  const { entries, isLoading: bwLoading, addEntry, fetchEntries, removeEntry } =
    useBodyWeightStore();
  const { settings } = useSettingsStore();
  const [weightInput, setWeightInput] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Photos ───────────────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  useEffect(() => {
    void fetchSessions();
    void fetchEntries();
    void loadPhotos();
  }, [fetchSessions, fetchEntries]);

  async function loadPhotos() {
    setPhotosLoading(true);
    try {
      const data = await photosService.getProgressPhotos();
      setPhotos(data);
    } catch {
      // silently fail — tab will show empty state
    } finally {
      setPhotosLoading(false);
    }
  }

  // ── History ──────────────────────────────────────────────────────────────────
  const listData = useMemo<ListItem[]>(() => {
    type DateGroup = { dateKey: string; label: string; items: WorkoutSession[] };
    const grouped = sessions.reduce<Record<string, DateGroup>>((acc, s) => {
      const key = toDateKey(s.startedAt);
      if (!acc[key]) {
        acc[key] = { dateKey: key, label: formatRelativeDate(s.startedAt), items: [] };
      }
      acc[key].items.push(s);
      return acc;
    }, {});
    return Object.values(grouped)
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .flatMap((group): ListItem[] => [
        { type: 'header', dateKey: group.dateKey, label: group.label },
        ...group.items
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .map((session): ListItem => ({ type: 'session', session })),
      ]);
  }, [sessions]);

  function renderHistoryItem({ item }: { item: ListItem }) {
    if (item.type === 'header') {
      return (
        <View className="px-4 pt-5 pb-2">
          <Text className="text-secondary text-xs font-medium uppercase tracking-widest">
            {item.label}
          </Text>
        </View>
      );
    }
    return (
      <View className="px-4 mb-3">
        <WorkoutHistoryCard
          session={item.session}
          onPress={() => router.push(`/workout/${item.session.id}`)}
        />
      </View>
    );
  }

  // ── Body weight ──────────────────────────────────────────────────────────────
  async function handleAddWeight() {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;
    setSaving(true);
    try {
      await addEntry({
        weight: w,
        unit: settings?.weightUnit ?? 'kg',
        date: new Date().toISOString(),
      });
      setWeightInput('');
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteWeight(id: string) {
    Alert.alert('Delete entry', 'Remove this weight entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void removeEntry(id) },
    ]);
  }

  // ── Photos ───────────────────────────────────────────────────────────────────
  async function handlePickPhoto() {
    const uri = await photosService.pickPhotoFromGallery();
    if (!uri) return;
    try {
      const photo = await photosService.addProgressPhoto({
        uri,
        date: new Date().toISOString(),
        notes: undefined,
      });
      setPhotos((prev) => [photo, ...prev]);
    } catch (err: unknown) {
      Alert.alert('Photo error', err instanceof Error ? err.message : 'Failed to save photo.');
    }
  }

  async function handleTakePhoto() {
    const uri = await photosService.takePhotoWithCamera();
    if (!uri) return;
    try {
      const photo = await photosService.addProgressPhoto({
        uri,
        date: new Date().toISOString(),
        notes: undefined,
      });
      setPhotos((prev) => [photo, ...prev]);
    } catch (err: unknown) {
      Alert.alert('Photo error', err instanceof Error ? err.message : 'Failed to save photo.');
    }
  }

  function handleDeletePhoto(id: string) {
    Alert.alert('Delete photo', 'Remove this progress photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void photosService.deleteProgressPhoto(id);
          setPhotos((prev) => prev.filter((p) => p.id !== id));
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-4 pb-2 border-b border-border">
        <Text className="text-foreground text-lg font-semibold">Progress</Text>
      </View>

      {/* Tab bar */}
      <View className="flex-row border-b border-border">
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            className="flex-1 py-3 items-center"
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              className={
                activeTab === tab.key
                  ? 'text-primary font-semibold text-sm'
                  : 'text-secondary text-sm'
              }
            >
              {tab.label}
            </Text>
            {activeTab === tab.key && (
              <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
            )}
          </Pressable>
        ))}
      </View>

      {/* ── History tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'history' &&
        (sessionsLoading && sessions.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item) =>
              item.type === 'header' ? `h-${item.dateKey}` : item.session.id
            }
            renderItem={renderHistoryItem}
            ListEmptyComponent={
              <EmptyState
                icon="time-outline"
                title="No workouts yet"
                subtitle="Complete your first workout to see your history here."
              />
            }
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        ))}

      {/* ── Body Weight tab ──────────────────────────────────────────────────── */}
      {activeTab === 'bodyweight' && (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="px-4 py-4">
              <Text className="text-foreground text-base font-semibold mb-3">Log Weight</Text>
              <View className="flex-row gap-3">
                <TextInput
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-base"
                  placeholder={`Weight (${settings?.weightUnit ?? 'kg'})`}
                  placeholderTextColor="#6B7280"
                  keyboardType="decimal-pad"
                  value={weightInput}
                  onChangeText={setWeightInput}
                />
                <Button
                  label="Add"
                  size="md"
                  disabled={saving || weightInput.trim() === ''}
                  onPress={() => void handleAddWeight()}
                />
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="px-4 mb-2">
              <View className="bg-surface rounded-xl px-4 py-3 flex-row justify-between items-center border border-border">
                <View>
                  <Text className="text-foreground text-base font-semibold">
                    {item.weight} {item.unit}
                  </Text>
                  <Text className="text-secondary text-xs mt-0.5">
                    {formatRelativeDate(item.date)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteWeight(item.id)}>
                  <Ionicons name="trash-outline" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            bwLoading ? (
              <LoadingSpinner />
            ) : (
              <EmptyState
                icon="scale-outline"
                title="No entries yet"
                subtitle="Log your body weight to track progress over time."
              />
            )
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* ── Photos tab ───────────────────────────────────────────────────────── */}
      {activeTab === 'photos' && (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={3}
          ListHeaderComponent={
            <View className="px-4 py-4 flex-row gap-3">
              <Button
                label="Camera"
                variant="secondary"
                size="sm"
                onPress={() => void handleTakePhoto()}
              />
              <Button
                label="Gallery"
                variant="secondary"
                size="sm"
                onPress={() => void handlePickPhoto()}
              />
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, margin: 1 }}
              onLongPress={() => handleDeletePhoto(item.id)}
            >
              <Image
                source={{ uri: item.uri }}
                style={{ width: PHOTO_SIZE, height: PHOTO_SIZE }}
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            photosLoading ? (
              <LoadingSpinner />
            ) : (
              <EmptyState
                icon="camera-outline"
                title="No photos yet"
                subtitle="Take or pick a photo to track your physique progress."
              />
            )
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

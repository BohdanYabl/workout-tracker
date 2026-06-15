import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const TABS: TabConfig[] = [
  { name: 'index', title: 'Dashboard', icon: 'home-outline', activeIcon: 'home' },
  { name: 'library', title: 'Library', icon: 'barbell-outline', activeIcon: 'barbell' },
  { name: 'routines', title: 'Routines', icon: 'list-outline', activeIcon: 'list' },
  { name: 'progress', title: 'Progress', icon: 'stats-chart-outline', activeIcon: 'stats-chart' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      {TABS.map(({ name, title, icon, activeIcon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? activeIcon : icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
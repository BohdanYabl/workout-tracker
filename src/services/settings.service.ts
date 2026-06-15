import { supabase } from './supabase';
import { UserSettings, WeightUnit, Theme } from '../types';

interface SettingsRow {
  id: string;
  user_id: string;
  default_rest_seconds: number;
  weight_unit: WeightUnit;
  theme: Theme;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface SettingsUpsert {
  user_id: string;
  default_rest_seconds?: number;
  weight_unit?: WeightUnit;
  theme?: Theme;
  notifications_enabled?: boolean;
}

function fromRow(row: SettingsRow): UserSettings {
  return {
    defaultRestSeconds: row.default_rest_seconds,
    weightUnit: row.weight_unit,
    theme: row.theme,
    notificationsEnabled: row.notifications_enabled,
  };
}

export async function getSettings(): Promise<UserSettings | null> {
  const { data, error } = await supabase.from('settings').select('*').maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return fromRow(data as unknown as SettingsRow);
}

export async function upsertSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('Not authenticated');

  const dbData: SettingsUpsert = { user_id: user.id };
  if (updates.defaultRestSeconds !== undefined)
    dbData.default_rest_seconds = updates.defaultRestSeconds;
  if (updates.weightUnit !== undefined) dbData.weight_unit = updates.weightUnit;
  if (updates.theme !== undefined) dbData.theme = updates.theme;
  if (updates.notificationsEnabled !== undefined)
    dbData.notifications_enabled = updates.notificationsEnabled;

  const { data, error } = await supabase
    .from('settings')
    .upsert(dbData, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as SettingsRow);
}

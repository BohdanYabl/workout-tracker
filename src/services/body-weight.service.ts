import { supabase } from './supabase';
import type { BodyWeightEntry, WeightUnit } from '../types';

interface BodyWeightRow {
  id: string;
  user_id: string;
  weight: number;
  unit: WeightUnit;
  date: string;
  created_at: string;
}

function fromRow(row: BodyWeightRow): BodyWeightEntry {
  return { id: row.id, weight: row.weight, unit: row.unit, date: row.date };
}

export async function getBodyWeightEntries(): Promise<BodyWeightEntry[]> {
  const { data, error } = await supabase
    .from('body_weight')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as BodyWeightRow[]).map(fromRow);
}

export type CreateBodyWeightData = Omit<BodyWeightEntry, 'id'>;

export async function addBodyWeightEntry(input: CreateBodyWeightData): Promise<BodyWeightEntry> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('body_weight')
    .insert({ user_id: user.id, weight: input.weight, unit: input.unit, date: input.date })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as BodyWeightRow);
}

export async function deleteBodyWeightEntry(id: string): Promise<void> {
  const { error } = await supabase.from('body_weight').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

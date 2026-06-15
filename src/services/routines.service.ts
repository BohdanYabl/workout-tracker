import { supabase } from './supabase';
import { Routine, RoutineExercise } from '../types';

interface RoutineRow {
  id: string;
  user_id: string;
  name: string;
  exercises: RoutineExercise[];
  created_at: string;
  updated_at: string;
}

function fromRow(row: RoutineRow): Routine {
  return {
    id: row.id,
    name: row.name,
    exercises: row.exercises,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getRoutines(): Promise<Routine[]> {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as RoutineRow[]).map(fromRow);
}

export async function createRoutine(
  name: string,
  exercises: RoutineExercise[],
): Promise<Routine> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('routines')
    .insert({ user_id: user.id, name, exercises })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as RoutineRow);
}

export async function updateRoutine(
  id: string,
  updates: Partial<Pick<Routine, 'name' | 'exercises'>>,
): Promise<Routine> {
  const dbUpdates: { name?: string; exercises?: RoutineExercise[] } = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.exercises !== undefined) dbUpdates.exercises = updates.exercises;

  const { data, error } = await supabase
    .from('routines')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as RoutineRow);
}

export async function deleteRoutine(id: string): Promise<void> {
  const { error } = await supabase.from('routines').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

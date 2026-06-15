import { supabase } from './supabase';
import { WorkoutSession, WorkoutExercise } from '../types';

interface WorkoutSessionRow {
  id: string;
  user_id: string;
  routine_name: string;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  exercises: WorkoutExercise[];
  notes: string | null;
  total_volume: number;
  created_at: string;
}

function fromRow(row: WorkoutSessionRow): WorkoutSession {
  return {
    id: row.id,
    routineName: row.routine_name,
    startedAt: row.started_at,
    finishedAt: row.finished_at ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    exercises: row.exercises,
    notes: row.notes ?? undefined,
    totalVolume: row.total_volume,
  };
}

export async function getWorkouts(): Promise<WorkoutSession[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .order('started_at', { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as WorkoutSessionRow[]).map(fromRow);
}

export async function getWorkout(id: string): Promise<WorkoutSession> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as WorkoutSessionRow);
}

export type CreateWorkoutData = Omit<WorkoutSession, 'id'>;

export async function createWorkout(input: CreateWorkoutData): Promise<WorkoutSession> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      routine_name: input.routineName,
      started_at: input.startedAt,
      finished_at: input.finishedAt ?? null,
      duration_seconds: input.durationSeconds ?? null,
      exercises: input.exercises,
      notes: input.notes ?? null,
      total_volume: input.totalVolume,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as unknown as WorkoutSessionRow);
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from('workout_sessions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

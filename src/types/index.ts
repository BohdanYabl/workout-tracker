export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'fullBody';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'bodyweight'
  | 'cable'
  | 'kettlebell';

export type WeightUnit = 'kg' | 'lbs';

export type Theme = 'dark' | 'light';

// ── Exercise library ────────────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  description: string;
  instructions: string[];
  isCustom: boolean;
  isFavorite: boolean;
}

// ── Routines ────────────────────────────────────────────────────────────────

export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  restSeconds: number;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
  updatedAt: string;
}

// ── Active workout & history ────────────────────────────────────────────────

export interface WorkoutSet {
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
  isPersonalRecord: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  routineName: string;
  startedAt: string;
  finishedAt: string | undefined;
  durationSeconds: number | undefined;
  exercises: WorkoutExercise[];
  notes: string | undefined;
  totalVolume: number;
}

// ── Progress tracking ────────────────────────────────────────────────────────

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  achievedAt: string;
}

export interface BodyWeightEntry {
  id: string;
  weight: number;
  unit: WeightUnit;
  date: string;
}

export interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  notes: string | undefined;
}

// ── Settings ─────────────────────────────────────────────────────────────────

export interface UserSettings {
  defaultRestSeconds: number;
  weightUnit: WeightUnit;
  theme: Theme;
  notificationsEnabled: boolean;
}

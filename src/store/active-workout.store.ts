import { create } from 'zustand';
import type {
  Routine,
  WorkoutSession,
  WorkoutExercise,
  WorkoutSet,
  PersonalRecord,
} from '../types';
import { EXERCISES } from '../data/exercises';
import { calculateVolume, isPersonalRecord } from '../utils/workout.utils';

// ── Exported types ────────────────────────────────────────────────────────────

export interface ActiveSet {
  setNumber: number;
  weight: number;
  reps: number;
  isCompleted: boolean;
  isPersonalRecord: boolean;
}

export interface ActiveExercise {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  restSeconds: number;
  sets: ActiveSet[];
}

// ── Store interface ───────────────────────────────────────────────────────────

interface ActiveWorkoutState {
  routineId: string | null;
  routineName: string;
  startedAt: Date | null;
  exercises: ActiveExercise[];
  isActive: boolean;
  elapsedSeconds: number;
  restSeconds: number | null;
  timerInterval: ReturnType<typeof setInterval> | null;
  completedSession: WorkoutSession | null;

  startWorkout: (routine: Routine) => void;
  startElapsedTimer: () => void;
  stopElapsedTimer: () => void;
  updateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: number,
  ) => void;
  toggleSetComplete: (exerciseIndex: number, setIndex: number) => void;
  startRestTimer: (seconds: number) => void;
  skipRest: () => void;
  finishWorkout: () => WorkoutSession;
  cancelWorkout: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
  routineId: null,
  routineName: '',
  startedAt: null,
  exercises: [],
  isActive: false,
  elapsedSeconds: 0,
  restSeconds: null,
  timerInterval: null,
  completedSession: null,

  startWorkout: (routine) => {
    const existing = get().timerInterval;
    if (existing !== null) clearInterval(existing);

    const exercises: ActiveExercise[] = routine.exercises.map((re) => {
      const found = EXERCISES.find((e) => e.id === re.exerciseId);
      return {
        exerciseId: re.exerciseId,
        exerciseName: found?.name ?? re.exerciseId,
        targetSets: re.targetSets,
        targetReps: re.targetReps,
        targetWeight: re.targetWeight,
        restSeconds: re.restSeconds,
        sets: Array.from({ length: re.targetSets }, (_, i) => ({
          setNumber: i + 1,
          weight: re.targetWeight,
          reps: re.targetReps,
          isCompleted: false,
          isPersonalRecord: false,
        })),
      };
    });

    set({
      routineId: routine.id,
      routineName: routine.name,
      startedAt: new Date(),
      exercises,
      isActive: true,
      elapsedSeconds: 0,
      restSeconds: null,
      timerInterval: null,
      completedSession: null,
    });

    get().startElapsedTimer();
  },

  startElapsedTimer: () => {
    const existing = get().timerInterval;
    if (existing !== null) clearInterval(existing);

    const interval = setInterval(() => {
      set((state) => ({
        elapsedSeconds: state.elapsedSeconds + 1,
        // Rest countdown shares the same tick so we only need one interval
        restSeconds:
          state.restSeconds === null
            ? null
            : state.restSeconds <= 1
              ? null
              : state.restSeconds - 1,
      }));
    }, 1000);

    set({ timerInterval: interval });
  },

  stopElapsedTimer: () => {
    const interval = get().timerInterval;
    if (interval !== null) clearInterval(interval);
    set({ timerInterval: null });
  },

  updateSet: (exerciseIndex, setIndex, field, value) => {
    const exercises = get().exercises.map((ex, ei) => {
      if (ei !== exerciseIndex) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s, si) =>
          si === setIndex ? { ...s, [field]: value } : s,
        ),
      };
    });
    set({ exercises });
  },

  toggleSetComplete: (exerciseIndex, setIndex) => {
    const state = get();
    const exercise = state.exercises[exerciseIndex];
    if (!exercise) return;
    const workoutSet = exercise.sets[setIndex];
    if (!workoutSet) return;

    const isCompleting = !workoutSet.isCompleted;

    let isPR = false;
    if (isCompleting && workoutSet.weight > 0 && workoutSet.reps > 0) {
      // Build history from already-completed sets in this exercise for within-workout PR detection
      const history: PersonalRecord[] = exercise.sets
        .filter((s) => s.isCompleted)
        .map((s) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          weight: s.weight,
          reps: s.reps,
          achievedAt: new Date().toISOString(),
        }));
      isPR = isPersonalRecord(workoutSet.weight, workoutSet.reps, history, exercise.exerciseId);
    }

    const exercises = state.exercises.map((ex, ei) => {
      if (ei !== exerciseIndex) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s, si) => {
          if (si !== setIndex) return s;
          return isCompleting
            ? { ...s, isCompleted: true, isPersonalRecord: isPR }
            : { ...s, isCompleted: false, isPersonalRecord: false };
        }),
      };
    });

    set({ exercises });

    if (isCompleting && exercise.restSeconds > 0) {
      set({ restSeconds: exercise.restSeconds });
    }
  },

  startRestTimer: (seconds) => {
    set({ restSeconds: seconds });
  },

  skipRest: () => {
    set({ restSeconds: null });
  },

  finishWorkout: () => {
    const state = get();
    get().stopElapsedTimer();

    const startedAt = state.startedAt ?? new Date();

    const workoutExercises: WorkoutExercise[] = state.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      exerciseName: ex.exerciseName,
      sets: ex.sets.map(
        (s): WorkoutSet => ({
          setNumber: s.setNumber,
          weight: s.weight,
          reps: s.reps,
          isCompleted: s.isCompleted,
          isPersonalRecord: s.isPersonalRecord,
        }),
      ),
    }));

    const totalVolume = calculateVolume(workoutExercises.flatMap((e) => e.sets));

    const session: WorkoutSession = {
      id: Date.now().toString(), // Temporary — DB assigns the real UUID on insert
      routineName: state.routineName,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      durationSeconds: state.elapsedSeconds,
      exercises: workoutExercises,
      notes: undefined,
      totalVolume,
    };

    set({ completedSession: session, isActive: false, restSeconds: null });

    return session;
  },

  cancelWorkout: () => {
    get().stopElapsedTimer();
    set({
      routineId: null,
      routineName: '',
      startedAt: null,
      exercises: [],
      isActive: false,
      elapsedSeconds: 0,
      restSeconds: null,
      timerInterval: null,
      completedSession: null,
    });
  },
}));

import { Exercise } from '../types';

function toId(name: string): string {
  return name.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function exercise(
  name: string,
  partial: Omit<Exercise, 'id' | 'name' | 'isCustom' | 'isFavorite'>,
): Exercise {
  return { id: toId(name), name, isCustom: false, isFavorite: false, ...partial };
}

export const EXERCISES: Exercise[] = [
  // ── Chest ────────────────────────────────────────────────────────────────
  exercise('Barbell Bench Press', {
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    description: 'The classic horizontal press; the primary mass-builder for the chest.',
    instructions: [
      'Lie flat on the bench, grip the bar slightly wider than shoulder-width.',
      'Lower the bar under control until it lightly touches your mid-chest.',
      'Press the bar back up explosively, locking out the elbows at the top.',
    ],
  }),
  exercise('Incline Dumbbell Press', {
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    description: 'An incline press that shifts emphasis to the upper chest.',
    instructions: [
      'Set the bench to 30–45° and hold a dumbbell in each hand at chest height.',
      'Press the dumbbells up and slightly inward until your arms are extended.',
      'Lower with control until your elbows are roughly in line with your shoulders.',
    ],
  }),
  exercise('Push-Up', {
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders', 'core'],
    equipment: 'bodyweight',
    description: 'A foundational bodyweight press that requires no equipment.',
    instructions: [
      'Start in a high plank with hands slightly wider than shoulder-width.',
      'Lower your chest to just above the floor, keeping elbows at ~45°.',
      'Push back up to full arm extension while keeping the core braced.',
    ],
  }),
  exercise('Cable Fly', {
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    description: 'An isolation fly that keeps constant tension on the chest throughout the range of motion.',
    instructions: [
      'Stand between two high-pulley cable stations and hold one handle in each hand.',
      'With a slight elbow bend, sweep the handles down and together in front of your hips.',
      'Slowly return to the start, feeling a full stretch across the chest.',
    ],
  }),
  exercise('Dumbbell Chest Fly', {
    muscleGroup: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'dumbbell',
    description: 'A flat-bench isolation fly for the chest with a deep stretch at the bottom.',
    instructions: [
      'Lie flat on a bench holding dumbbells directly above your chest, palms facing in.',
      'Lower the weights in wide arcs until you feel a deep stretch in the pecs.',
      'Squeeze the chest to bring the dumbbells back up along the same arc.',
    ],
  }),
  exercise('Decline Bench Press', {
    muscleGroup: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    description: 'A decline-angle press that targets the lower portion of the chest.',
    instructions: [
      'Secure your feet under the pads of a decline bench and grip the bar slightly wider than shoulder-width.',
      'Unrack and lower the bar to your lower chest under control.',
      'Press the bar back up to full lockout.',
    ],
  }),

  // ── Back ─────────────────────────────────────────────────────────────────
  exercise('Pull-Up', {
    muscleGroup: 'back',
    secondaryMuscles: ['biceps', 'core'],
    equipment: 'bodyweight',
    description: 'A compound pull that builds the lats and overall back width.',
    instructions: [
      'Hang from a pull-up bar with hands slightly wider than shoulder-width, palms facing away.',
      'Pull yourself up until your chin clears the bar, driving elbows down and back.',
      'Lower with control to full hang before the next rep.',
    ],
  }),
  exercise('Barbell Row', {
    muscleGroup: 'back',
    secondaryMuscles: ['biceps', 'core', 'hamstrings'],
    equipment: 'barbell',
    description: 'A horizontal row that builds overall back thickness and strength.',
    instructions: [
      'Hinge to roughly 45° with a flat back, grip the bar just outside your legs.',
      'Pull the bar into your lower abdomen, driving elbows past your torso.',
      'Lower under control, keeping the hinge position throughout.',
    ],
  }),
  exercise('Lat Pulldown', {
    muscleGroup: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'cable',
    description: 'A machine-assisted pulling exercise that mimics the pull-up pattern.',
    instructions: [
      'Sit with thighs under the pads and grip the bar wider than shoulder-width.',
      'Pull the bar to your upper chest, leading with the elbows.',
      'Return the bar slowly to full arm extension to maximise lat stretch.',
    ],
  }),
  exercise('Seated Cable Row', {
    muscleGroup: 'back',
    secondaryMuscles: ['biceps', 'core'],
    equipment: 'cable',
    description: 'A cable row that emphasises mid-back thickness through a full range of motion.',
    instructions: [
      'Sit upright and hold the cable attachment with arms extended, slight forward lean.',
      'Row the handle into your abdomen, keeping elbows close and squeezing the shoulder blades.',
      'Return to the start with a controlled reach forward.',
    ],
  }),
  exercise('Dumbbell Row', {
    muscleGroup: 'back',
    secondaryMuscles: ['biceps', 'core'],
    equipment: 'dumbbell',
    description: 'A unilateral row that allows a greater range of motion and corrects imbalances.',
    instructions: [
      'Place one knee and hand on a bench, hold a dumbbell with the opposite hand.',
      'Row the dumbbell up towards your hip, elbow brushing your side.',
      'Lower with control until the arm is fully extended.',
    ],
  }),
  exercise('Deadlift', {
    muscleGroup: 'back',
    secondaryMuscles: ['glutes', 'hamstrings', 'core', 'quads'],
    equipment: 'barbell',
    description: 'The king of compound lifts; trains the entire posterior chain.',
    instructions: [
      'Stand over the bar with feet hip-width, grip just outside your legs.',
      'Brace your core, keep your chest up, and drive through the floor to stand.',
      'Hinge back to lower the bar along your legs, maintaining a flat back throughout.',
    ],
  }),

  // ── Shoulders ────────────────────────────────────────────────────────────
  exercise('Overhead Press', {
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'barbell',
    description: 'A standing press that builds the deltoids and overhead strength.',
    instructions: [
      'Hold the bar at upper-chest height with hands just outside shoulder-width.',
      'Press the bar straight up, moving your head back slightly to clear the bar path.',
      'Lock out at the top, then lower under control to the starting position.',
    ],
  }),
  exercise('Dumbbell Lateral Raise', {
    muscleGroup: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    description: 'An isolation exercise for the medial deltoid that creates shoulder width.',
    instructions: [
      'Stand with dumbbells at your sides, slight bend in the elbows.',
      'Raise both arms out to the sides until they reach shoulder height.',
      'Lower slowly back to the start; avoid using momentum.',
    ],
  }),
  exercise('Arnold Press', {
    muscleGroup: 'shoulders',
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    description: 'A rotating dumbbell press that targets all three heads of the deltoid.',
    instructions: [
      'Hold dumbbells at shoulder height with palms facing you, as at the top of a curl.',
      'Press up while rotating your palms outward so they face forward at the top.',
      'Reverse the rotation as you lower back to the starting position.',
    ],
  }),
  exercise('Cable Face Pull', {
    muscleGroup: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'cable',
    description: 'A rear-delt and upper-back exercise that improves shoulder health.',
    instructions: [
      'Set a cable pulley to face height and attach a rope handle.',
      'Pull the rope to your forehead, flaring your elbows out and up.',
      'Return slowly; keep the upper arms parallel to the floor throughout.',
    ],
  }),

  // ── Biceps ────────────────────────────────────────────────────────────────
  exercise('Barbell Curl', {
    muscleGroup: 'biceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    description: 'The standard curl; allows the most weight for bicep development.',
    instructions: [
      'Stand with feet shoulder-width, grip the bar at hip level with palms facing up.',
      'Curl the bar to shoulder height by bending the elbows, keeping them pinned to your sides.',
      'Lower with control over two counts.',
    ],
  }),
  exercise('Dumbbell Hammer Curl', {
    muscleGroup: 'biceps',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    description: 'A neutral-grip curl that also targets the brachialis for arm thickness.',
    instructions: [
      'Hold dumbbells at your sides with palms facing your body.',
      'Curl both dumbbells up while keeping the neutral (thumb-up) grip.',
      'Lower under control and repeat.',
    ],
  }),
  exercise('Cable Curl', {
    muscleGroup: 'biceps',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'A cable curl that maintains tension on the biceps at both ends of the movement.',
    instructions: [
      'Stand facing a low-pulley cable and grip a straight bar or EZ-bar.',
      'Curl the bar up to shoulder height, holding the contraction briefly.',
      'Lower slowly to keep tension through the full range.',
    ],
  }),

  // ── Triceps ───────────────────────────────────────────────────────────────
  exercise('Tricep Dip', {
    muscleGroup: 'triceps',
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'bodyweight',
    description: 'A bodyweight compound that builds the triceps and lower chest.',
    instructions: [
      'Support yourself on parallel bars with arms fully extended.',
      'Lower your body by bending the elbows until your upper arms are parallel to the floor.',
      'Press back up to full lockout.',
    ],
  }),
  exercise('Skull Crusher', {
    muscleGroup: 'triceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    description: 'A lying extension that isolates the triceps through a long range of motion.',
    instructions: [
      'Lie on a bench with an EZ-bar extended over your chest.',
      'Keeping upper arms vertical, lower the bar to your forehead by bending the elbows.',
      'Extend back to the start without locking out aggressively.',
    ],
  }),
  exercise('Cable Pushdown', {
    muscleGroup: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'A high-pulley isolation exercise for the triceps with constant tension.',
    instructions: [
      'Stand facing a high cable with a rope or straight bar attachment.',
      'Keeping elbows at your sides, push the attachment down until arms are fully extended.',
      'Let the attachment rise slowly back to a 90° elbow angle.',
    ],
  }),

  // ── Quads ─────────────────────────────────────────────────────────────────
  exercise('Barbell Squat', {
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
    description: 'The foundational lower-body compound that builds total leg mass and strength.',
    instructions: [
      'Bar sits on your upper traps; feet shoulder-width with toes slightly out.',
      'Brace your core and descend until your thighs are parallel to the floor.',
      'Drive through the floor to stand, keeping knees tracking over your toes.',
    ],
  }),
  exercise('Leg Press', {
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
    description: 'A machine press that allows heavy quad loading without spinal stress.',
    instructions: [
      'Sit in the machine with feet hip-width and flat on the platform.',
      'Lower the platform until your knees reach 90°, keeping lower back on the pad.',
      'Press back to near-full extension without locking out the knees.',
    ],
  }),
  exercise('Leg Extension', {
    muscleGroup: 'quads',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'An isolation exercise that targets the quadriceps through the knee-extension movement.',
    instructions: [
      'Sit in the machine with the pad across your lower shins.',
      'Extend your legs to full contraction, squeezing the quads at the top.',
      'Lower slowly under control back to the start position.',
    ],
  }),
  exercise('Bulgarian Split Squat', {
    muscleGroup: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'dumbbell',
    description: 'A unilateral squat that develops single-leg strength and balance.',
    instructions: [
      'Place your rear foot on a bench and hold dumbbells at your sides.',
      'Lower your back knee toward the floor until your front thigh is parallel.',
      'Drive through your front heel to return to the start.',
    ],
  }),

  // ── Hamstrings ────────────────────────────────────────────────────────────
  exercise('Romanian Deadlift', {
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['glutes', 'back', 'core'],
    equipment: 'barbell',
    description: 'A hip-hinge movement that emphasises the hamstrings and glutes through a deep stretch.',
    instructions: [
      'Stand holding the bar at hip level with a shoulder-width grip.',
      'Hinge forward at the hips, lowering the bar along your legs until you feel a strong hamstring stretch.',
      'Drive hips forward to return to standing; do not round the lower back.',
    ],
  }),
  exercise('Leg Curl', {
    muscleGroup: 'hamstrings',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'A machine isolation exercise for the hamstrings through knee flexion.',
    instructions: [
      'Lie face-down on the machine with the pad behind your lower calves.',
      'Curl your heels toward your glutes as far as the machine allows.',
      'Lower the weight slowly back to the start.',
    ],
  }),
  exercise('Nordic Hamstring Curl', {
    muscleGroup: 'hamstrings',
    secondaryMuscles: ['glutes', 'core'],
    equipment: 'bodyweight',
    description: 'A demanding bodyweight exercise that strengthens the hamstrings eccentrically.',
    instructions: [
      'Kneel on a mat with your ankles held down by a partner or anchor.',
      'Lower your body toward the floor as slowly as possible, using hamstring tension to resist.',
      'Use your hands to catch yourself, then push back to the start.',
    ],
  }),

  // ── Glutes ────────────────────────────────────────────────────────────────
  exercise('Barbell Hip Thrust', {
    muscleGroup: 'glutes',
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
    description: 'The most effective loaded exercise for maximum glute activation.',
    instructions: [
      'Sit with your upper back against a bench and a padded barbell across your hips.',
      'Drive through your heels to raise your hips until your body forms a straight line.',
      'Squeeze the glutes at the top, then lower under control.',
    ],
  }),
  exercise('Glute Bridge', {
    muscleGroup: 'glutes',
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'bodyweight',
    description: 'A floor-based glute activator suitable for warm-ups or direct glute work.',
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Drive through your heels to lift your hips until your body forms a straight line.',
      'Hold the top position for one second, squeezing the glutes, then lower.',
    ],
  }),
  exercise('Cable Kickback', {
    muscleGroup: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'cable',
    description: 'A cable isolation exercise for the glutes through hip extension.',
    instructions: [
      'Attach an ankle cuff to a low cable and face the machine.',
      'Kick the working leg straight back, extending the hip fully.',
      'Return to the start under control without swinging.',
    ],
  }),
  exercise('Kettlebell Swing', {
    muscleGroup: 'glutes',
    secondaryMuscles: ['hamstrings', 'core', 'back', 'shoulders'],
    equipment: 'kettlebell',
    description: 'A ballistic hip-hinge movement that develops power and conditions the posterior chain.',
    instructions: [
      'Stand over the kettlebell, hike it back between your legs with a flat back.',
      'Drive the hips forward explosively to swing the bell to chest height.',
      'Let the bell swing back and immediately go into the next rep.',
    ],
  }),

  // ── Calves ────────────────────────────────────────────────────────────────
  exercise('Standing Calf Raise', {
    muscleGroup: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'The primary exercise for the gastrocnemius (upper calf) through a full range of motion.',
    instructions: [
      'Stand on the calf-raise machine with the pads on your shoulders and heels hanging off the platform.',
      'Rise onto your toes as high as possible, holding briefly at the top.',
      'Lower your heels below the platform level for a full stretch.',
    ],
  }),
  exercise('Seated Calf Raise', {
    muscleGroup: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
    description: 'A seated variant that isolates the soleus, the deeper calf muscle.',
    instructions: [
      'Sit in the machine with the pads on your lower thighs and the balls of your feet on the platform.',
      'Raise your heels as high as possible, squeezing the calves.',
      'Lower with a full stretch before the next rep.',
    ],
  }),

  // ── Core ──────────────────────────────────────────────────────────────────
  exercise('Plank', {
    muscleGroup: 'core',
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'bodyweight',
    description: 'An isometric hold that builds anti-extension core stability.',
    instructions: [
      'Start in a forearm position with elbows under your shoulders and body in a straight line.',
      'Brace your abs and glutes; avoid letting hips sag or pike.',
      'Hold for the target duration, breathing steadily.',
    ],
  }),
  exercise('Crunch', {
    muscleGroup: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    description: 'A foundational ab exercise that trains spinal flexion.',
    instructions: [
      'Lie on your back with knees bent, fingertips lightly behind your ears.',
      'Curl your shoulder blades off the floor by contracting your abs.',
      'Lower slowly, keeping a small gap between your lower back and the floor.',
    ],
  }),
  exercise('Hanging Leg Raise', {
    muscleGroup: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    description: 'A challenging hanging exercise that targets the lower abs and hip flexors.',
    instructions: [
      'Hang from a pull-up bar with arms fully extended.',
      'Raise your legs until they are parallel to the floor (or higher for advanced).',
      'Lower with control, avoiding swinging.',
    ],
  }),
  exercise('Cable Crunch', {
    muscleGroup: 'core',
    secondaryMuscles: [],
    equipment: 'cable',
    description: 'A weighted crunch variation that allows progressive overload for the abs.',
    instructions: [
      'Kneel in front of a high cable, holding the rope behind your head.',
      'Crunch down, pulling your elbows toward your knees by contracting your abs.',
      'Return to the start slowly, keeping constant tension on the cable.',
    ],
  }),
];

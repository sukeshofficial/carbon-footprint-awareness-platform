// Local constants to avoid cross-directory import issues
export const USER_TYPES = [
  'student',
  'working_professional',
  'remote_worker',
  'family_user',
  'hostel_resident',
  'frequent_traveler',
];

export const TONE_PREFERENCES = [
  'casual_coaching',
  'direct_analytical',
  'friendly_motivator',
];

export const HOUSEHOLD_TYPES = [
  'shared_home',
  'independent_home',
  'hostel',
  'family_home',
  'other',
];

// Re-exporting for frontend use to maintain single source of truth
// Wait, client shouldn't import from server directory usually in monorepos if not shared.
// I'll define them here for frontend as well to be safe, or if I can use the same file.
// Since it's a local workspace, I can try to import, but it might break build if paths are different in production.
// I'll define them here for now to avoid cross-directory import issues in React build.

export const USER_TYPES_LIST = [
  { id: 'student', title: 'Student', description: 'Currently studying or in a hostel.' },
  { id: 'working_professional', title: 'Professional', description: 'Working in a traditional office setup.' },
  { id: 'remote_worker', title: 'Remote Worker', description: 'Working primarily from home.' },
  { id: 'family_user', title: 'Family', description: 'Managing a household with family.' },
  { id: 'hostel_resident', title: 'Hostel Resident', description: 'Living in shared student/worker housing.' },
  { id: 'frequent_traveler', title: 'Traveler', description: 'On the move frequently for work or leisure.' },
];

export const TONE_PREFERENCES_LIST = [
  { id: 'casual_coaching', title: 'Casual', description: 'Relaxed and easy-going tone.' },
  { id: 'direct_analytical', title: 'Analytical', description: 'Data-driven and straight to the point.' },
  { id: 'friendly_motivator', title: 'Motivator', description: 'Encouraging and supportive tone.' },
];

export const HOUSEHOLD_TYPES_LIST = [
  { id: 'shared_home', title: 'Shared Home' },
  { id: 'independent_home', title: 'Independent' },
  { id: 'hostel', title: 'Hostel' },
  { id: 'family_home', title: 'Family Home' },
  { id: 'other', title: 'Other' },
];

export const TRANSPORT_MODES = [
  { id: 'car', title: 'Private Car' },
  { id: 'bike', title: 'Motorbike/Scooter' },
  { id: 'public_transport', title: 'Public Transport' },
  { id: 'cycle', title: 'Bicycle' },
  { id: 'walking', title: 'Walking' },
  { id: 'mixed', title: 'Mixed Modes' },
];

export const DIET_TYPES = [
  { id: 'vegan', title: 'Vegan' },
  { id: 'vegetarian', title: 'Vegetarian' },
  { id: 'non_vegetarian', title: 'Non-Vegetarian' },
  { id: 'mixed', title: 'Mixed / Flexitarian' },
];

export const FREQUENCY_OPTIONS = [
  { id: 'rarely', title: 'Rarely' },
  { id: 'average', title: 'Average' },
  { id: 'frequent', title: 'Frequent' },
];

export const AC_USAGE_OPTIONS = [
  { id: 'none', title: 'None' },
  { id: 'rarely', title: 'Rarely' },
  { id: 'moderate', title: 'Moderate' },
  { id: 'high', title: 'High' },
];

export const WASTE_HABIT_OPTIONS = [
  { id: 'never', title: 'Never' },
  { id: 'sometimes', title: 'Sometimes' },
  { id: 'always', title: 'Always' },
];

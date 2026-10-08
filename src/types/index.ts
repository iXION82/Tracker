// ===== Habit Types =====

export type HabitType = 'boolean' | 'numeric' | 'timer' | 'count';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';

export interface IHabit {
  _id: string;
  name: string;
  description?: string;
  type: HabitType;
  category: string;
  target?: number;
  unit?: string;
  frequency: HabitFrequency;
  customDays?: number[]; // 0=Sun, 1=Mon, ... 6=Sat
  color: string;
  icon: string;
  section?: string; // Morning, Work, Evening, Night
  order: number;
  active: boolean;
  reminder?: string; // Time string e.g. "08:00"
  createdAt: string;
  updatedAt: string;
}

export interface IHabitLog {
  _id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number;
  duration?: number; // minutes
  note?: string;
  createdAt: string;
}

// ===== Goal Types =====

export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export interface IGoal {
  _id: string;
  title: string;
  description?: string;
  target: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  category: string;
  linkedHabits: string[]; // habit IDs
  status: GoalStatus;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Task Types =====

export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  completed: boolean;
  completedAt?: string;
  category: string;
  goalId?: string;
  estimatedMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

// ===== Journal Types =====

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface IJournalEntry {
  _id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: MoodLevel;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ===== Mood Types =====

export interface IMoodEntry {
  _id: string;
  date: string; // YYYY-MM-DD
  mood: MoodLevel;
  energy: MoodLevel;
  stress: MoodLevel;
  note?: string;
  createdAt: string;
}

// ===== Sleep Types =====

export interface ISleepEntry {
  _id: string;
  date: string; // YYYY-MM-DD
  sleepTime: string; // ISO datetime
  wakeTime: string; // ISO datetime
  duration: number; // minutes
  quality: MoodLevel;
  note?: string;
  createdAt: string;
}

// ===== Time Entry Types =====

export interface ITimeEntry {
  _id: string;
  activity: string;
  category: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  note?: string;
  createdAt: string;
}

// ===== Category Types =====

export interface ICategory {
  _id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  createdAt: string;
}

// ===== User Settings Types =====

export interface ILifeScoreWeights {
  health: number;
  learning: number;
  productivity: number;
  habits: number;
  [key: string]: number;
}

export interface IUserSettings {
  _id: string;
  name: string;
  avatar?: string;
  theme: 'dark' | 'light';
  accentColor: string;
  dashboardWidgets: string[];
  lifeScoreWeights: ILifeScoreWeights;
  createdAt: string;
  updatedAt: string;
}

// ===== Dashboard Types =====

export interface DashboardStats {
  dailyCompletion: number;
  currentStreak: number;
  habitsCompleted: number;
  habitsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  productivity: number;
}

export interface MonthlyProgress {
  date: string;
  completed: number;
  total: number;
}

export interface TopHabit {
  habitId: string;
  name: string;
  color: string;
  completionRate: number;
}

// ===== API Response Types =====

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== Mood Emoji Map =====

export const MOOD_EMOJIS: Record<MoodLevel, { emoji: string; label: string }> = {
  1: { emoji: '😞', label: 'Terrible' },
  2: { emoji: '😔', label: 'Bad' },
  3: { emoji: '😐', label: 'Okay' },
  4: { emoji: '🙂', label: 'Good' },
  5: { emoji: '😄', label: 'Great' },
};

// ===== Default Colors =====

export const HABIT_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#10B981', // green
  '#F59E0B', // orange
  '#06B6D4', // cyan
  '#EF4444', // red
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#F97316', // orange-bright
];

export const CATEGORY_DEFAULTS = [
  { name: 'Health', color: '#10B981', icon: 'Heart' },
  { name: 'Fitness', color: '#EF4444', icon: 'Dumbbell' },
  { name: 'Learning', color: '#8B5CF6', icon: 'BookOpen' },
  { name: 'Productivity', color: '#3B82F6', icon: 'Zap' },
  { name: 'Career', color: '#F59E0B', icon: 'Briefcase' },
  { name: 'Finance', color: '#06B6D4', icon: 'DollarSign' },
  { name: 'Personal', color: '#EC4899', icon: 'User' },
  { name: 'Sleep', color: '#6366F1', icon: 'Moon' },
  { name: 'Social', color: '#14B8A6', icon: 'Users' },
  { name: 'Other', color: '#6B7280', icon: 'MoreHorizontal' },
];

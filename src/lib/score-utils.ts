import { ILifeScoreWeights } from '@/types';

interface ScoreInput {
  /** Percentage of habits completed today (0-100) */
  habitsCompletion: number;
  /** Percentage of tasks completed today (0-100) */
  tasksCompletion: number;
  /** Whether user exercised today */
  exercised: boolean;
  /** Sleep quality (1-5) */
  sleepQuality: number;
  /** Hours of productive work/study */
  productiveHours: number;
  /** Mood score (1-5) */
  mood: number;
  /** Whether journal was written */
  journaled: boolean;
}

const DEFAULT_WEIGHTS: ILifeScoreWeights = {
  health: 30,
  learning: 25,
  productivity: 25,
  habits: 20,
};

/**
 * Calculate the overall Life Score (0-100)
 * 
 * Categories:
 * - Health (30%): exercise + sleep quality + mood
 * - Learning (25%): productive hours 
 * - Productivity (25%): tasks completion + journaling
 * - Habits (20%): habits completion
 */
export function calculateLifeScore(
  input: ScoreInput,
  weights: ILifeScoreWeights = DEFAULT_WEIGHTS
): number {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // Health score (0-100)
  const exerciseScore = input.exercised ? 100 : 0;
  const sleepScore = (input.sleepQuality / 5) * 100;
  const moodScore = (input.mood / 5) * 100;
  const healthScore = (exerciseScore + sleepScore + moodScore) / 3;

  // Learning score (0-100)
  // Assumes 4 hours is a perfect day of study
  const learningScore = Math.min((input.productiveHours / 4) * 100, 100);

  // Productivity score (0-100)
  const journalScore = input.journaled ? 100 : 0;
  const productivityScore = (input.tasksCompletion + journalScore) / 2;

  // Habits score
  const habitsScore = input.habitsCompletion;

  // Weighted average
  const score =
    (healthScore * (weights.health || 0) +
      learningScore * (weights.learning || 0) +
      productivityScore * (weights.productivity || 0) +
      habitsScore * (weights.habits || 0)) /
    totalWeight;

  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Get Life Score category breakdown
 */
export function getScoreBreakdown(
  input: ScoreInput,
  weights: ILifeScoreWeights = DEFAULT_WEIGHTS
): Array<{ category: string; score: number; weight: number; color: string }> {
  const exerciseScore = input.exercised ? 100 : 0;
  const sleepScore = (input.sleepQuality / 5) * 100;
  const moodScore = (input.mood / 5) * 100;
  const healthScore = Math.round((exerciseScore + sleepScore + moodScore) / 3);

  const learningScore = Math.round(Math.min((input.productiveHours / 4) * 100, 100));

  const journalScore = input.journaled ? 100 : 0;
  const productivityScore = Math.round((input.tasksCompletion + journalScore) / 2);

  const habitsScore = Math.round(input.habitsCompletion);

  return [
    { category: 'Health', score: healthScore, weight: weights.health || 0, color: '#10B981' },
    { category: 'Learning', score: learningScore, weight: weights.learning || 0, color: '#8B5CF6' },
    { category: 'Productivity', score: productivityScore, weight: weights.productivity || 0, color: '#3B82F6' },
    { category: 'Habits', score: habitsScore, weight: weights.habits || 0, color: '#F59E0B' },
  ];
}

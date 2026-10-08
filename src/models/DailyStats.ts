import mongoose, { Schema, Model } from 'mongoose';

export interface IDailyStatsDocument {
  date: string;
  longestSessionMinutes: number;
  sleep?: {
    duration: number;
    quality: string;
  };
  health?: {
    meals: number;
    water: number;
  };
  habitsCompleted: number;
  tasksCompleted: number;
  totalScore: number;
  leetcodeProblems?: number;
  githubCommits?: number;
  codeforcesRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyStatsSchema = new Schema<IDailyStatsDocument>(
  {
    date: { type: String, required: true, unique: true },
    longestSessionMinutes: { type: Number, default: 0 },
    sleep: {
      duration: { type: Number, default: 0 },
      quality: { type: String, default: 'none' }
    },
    health: {
      meals: { type: Number, default: 0 },
      water: { type: Number, default: 0 }
    },
    habitsCompleted: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    leetcodeProblems: { type: Number, default: 0 },
    githubCommits: { type: Number, default: 0 },
    codeforcesRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DailyStats: Model<IDailyStatsDocument> =
  mongoose.models.DailyStats ||
  mongoose.model<IDailyStatsDocument>('DailyStats', DailyStatsSchema);

export default DailyStats;

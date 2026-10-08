import mongoose, { Schema, Model } from 'mongoose';

export interface IDailyStatsDocument {
  date: string;
  habitsCompleted: number;
  tasksCompleted: number;
  totalScore: number;
  leetcodeProblems?: number;
  githubCommits?: number;
  wakatimeMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyStatsSchema = new Schema<IDailyStatsDocument>(
  {
    date: { type: String, required: true, unique: true },
    habitsCompleted: { type: Number, default: 0 },
    tasksCompleted: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    leetcodeProblems: { type: Number, default: 0 },
    githubCommits: { type: Number, default: 0 },
    wakatimeMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DailyStats: Model<IDailyStatsDocument> =
  mongoose.models.DailyStats ||
  mongoose.model<IDailyStatsDocument>('DailyStats', DailyStatsSchema);

export default DailyStats;

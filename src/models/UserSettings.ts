import mongoose, { Schema, Model } from 'mongoose';

export interface IUserSettingsDocument {
  name: string;
  avatar?: string;
  theme: 'dark' | 'light';
  accentColor: string;
  dashboardWidgets: string[];
  lifeScoreWeights: {
    health: number;
    learning: number;
    productivity: number;
    habits: number;
    [key: string]: number;
  };
  integrations?: {
    githubUsername?: string;
    leetcodeUsername?: string;
    wakatimeApiKey?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettingsDocument>(
  {
    name: { type: String, default: 'User' },
    avatar: { type: String },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
    accentColor: { type: String, default: '#3B82F6' },
    dashboardWidgets: {
      type: [String],
      default: [
        'dailyCompletion',
        'currentStreak',
        'habitsCompleted',
        'tasksCompleted',
        'productivity',
      ],
    },
    lifeScoreWeights: {
      type: Schema.Types.Mixed,
      default: {
        health: 30,
        learning: 25,
        productivity: 25,
        habits: 20,
      },
    },
    integrations: {
      githubUsername: { type: String },
      leetcodeUsername: { type: String },
      wakatimeApiKey: { type: String },
    },
  },
  { timestamps: true }
);

const UserSettings: Model<IUserSettingsDocument> =
  mongoose.models.UserSettings ||
  mongoose.model<IUserSettingsDocument>('UserSettings', UserSettingsSchema);

export default UserSettings;

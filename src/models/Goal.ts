import mongoose, { Schema, Model } from 'mongoose';

export interface IGoalDocument {
  title: string;
  description?: string;
  target: number;
  currentValue: number;
  unit: string;
  deadline?: Date;
  category: string;
  linkedHabits: mongoose.Types.ObjectId[];
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoalDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    target: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, required: true },
    deadline: { type: Date },
    category: { type: String, default: 'Other' },
    linkedHabits: [{ type: Schema.Types.ObjectId, ref: 'Habit' }],
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'abandoned'],
      default: 'active',
    },
    color: { type: String, default: '#8B5CF6' },
  },
  { timestamps: true }
);

const Goal: Model<IGoalDocument> =
  mongoose.models.Goal || mongoose.model<IGoalDocument>('Goal', GoalSchema);

export default Goal;

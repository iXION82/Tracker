import mongoose, { Schema, Model } from 'mongoose';

export interface IHabitDocument {
  name: string;
  description?: string;
  type: 'boolean' | 'numeric' | 'timer' | 'count';
  category: string;
  target?: number;
  unit?: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly' | 'custom';
  customDays?: number[];
  color: string;
  icon: string;
  section?: string;
  order: number;
  active: boolean;
  reminder?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabitDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['boolean', 'numeric', 'timer', 'count'],
      default: 'boolean',
    },
    category: { type: String, required: true, default: 'Other' },
    target: { type: Number },
    unit: { type: String },
    frequency: {
      type: String,
      enum: ['daily', 'weekdays', 'weekends', 'weekly', 'custom'],
      default: 'daily',
    },
    customDays: [{ type: Number }],
    color: { type: String, default: '#3B82F6' },
    icon: { type: String, default: 'Circle' },
    section: { type: String, default: 'Morning' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    reminder: { type: String },
  },
  { timestamps: true }
);

const Habit: Model<IHabitDocument> =
  mongoose.models.Habit || mongoose.model<IHabitDocument>('Habit', HabitSchema);

export default Habit;

import mongoose, { Schema, Model } from 'mongoose';

export interface IHabitLogDocument {
  habitId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number;
  duration?: number; // minutes
  note?: string;
  createdAt: Date;
}

const HabitLogSchema = new Schema<IHabitLogDocument>(
  {
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
    date: { type: String, required: true, index: true },
    completed: { type: Boolean, default: false },
    value: { type: Number },
    duration: { type: Number },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound index for efficient queries
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

const HabitLog: Model<IHabitLogDocument> =
  mongoose.models.HabitLog || mongoose.model<IHabitLogDocument>('HabitLog', HabitLogSchema);

export default HabitLog;

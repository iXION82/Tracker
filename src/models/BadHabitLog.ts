import mongoose, { Schema, Model } from 'mongoose';

export interface IBadHabitLogDocument {
  badHabitId: mongoose.Types.ObjectId;
  date: string;
  durationMinutes: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BadHabitLogSchema = new Schema<IBadHabitLogDocument>(
  {
    badHabitId: { type: Schema.Types.ObjectId, ref: 'BadHabit', required: true },
    date: { type: String, required: true },
    durationMinutes: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

const BadHabitLog: Model<IBadHabitLogDocument> =
  mongoose.models.BadHabitLog ||
  mongoose.model<IBadHabitLogDocument>('BadHabitLog', BadHabitLogSchema);

export default BadHabitLog;

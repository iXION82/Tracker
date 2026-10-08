import mongoose, { Schema, Model } from 'mongoose';

export interface IBadHabitDocument {
  name: string;
  description?: string;
  category: string;
  penalty?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BadHabitSchema = new Schema<IBadHabitDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'General' },
    penalty: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BadHabit: Model<IBadHabitDocument> =
  mongoose.models.BadHabit ||
  mongoose.model<IBadHabitDocument>('BadHabit', BadHabitSchema);

export default BadHabit;

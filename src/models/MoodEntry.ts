import mongoose, { Schema, Model } from 'mongoose';

export interface IMoodEntryDocument {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  note?: string;
  createdAt: Date;
}

const MoodEntrySchema = new Schema<IMoodEntryDocument>(
  {
    date: { type: String, required: true, index: true, unique: true },
    mood: { type: Number, min: 1, max: 5, required: true },
    energy: { type: Number, min: 1, max: 5, required: true },
    stress: { type: Number, min: 1, max: 5, required: true },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const MoodEntry: Model<IMoodEntryDocument> =
  mongoose.models.MoodEntry || mongoose.model<IMoodEntryDocument>('MoodEntry', MoodEntrySchema);

export default MoodEntry;

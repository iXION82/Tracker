import mongoose, { Schema, Model } from 'mongoose';

export interface ISleepEntryDocument {
  date: string;
  sleepTime: string;
  wakeTime: string;
  duration: number; // minutes
  quality: number;
  note?: string;
  createdAt: Date;
}

const SleepEntrySchema = new Schema<ISleepEntryDocument>(
  {
    date: { type: String, required: true, index: true, unique: true },
    sleepTime: { type: String, required: true },
    wakeTime: { type: String, required: true },
    duration: { type: Number, required: true },
    quality: { type: Number, min: 1, max: 5, default: 3 },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const SleepEntry: Model<ISleepEntryDocument> =
  mongoose.models.SleepEntry || mongoose.model<ISleepEntryDocument>('SleepEntry', SleepEntrySchema);

export default SleepEntry;

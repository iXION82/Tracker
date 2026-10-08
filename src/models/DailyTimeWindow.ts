import mongoose, { Schema, Model } from 'mongoose';

export interface IDailyTimeWindowDocument {
  date: string;
  window: 'morning' | 'afternoon' | 'evening' | 'night';
  productiveHours: number;
  mood?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DailyTimeWindowSchema = new Schema<IDailyTimeWindowDocument>(
  {
    date: { type: String, required: true },
    window: { type: String, required: true, enum: ['morning', 'afternoon', 'evening', 'night'] },
    productiveHours: { type: Number, default: 0 },
    mood: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

// Compound unique index: one record per date+window
DailyTimeWindowSchema.index({ date: 1, window: 1 }, { unique: true });

const DailyTimeWindow: Model<IDailyTimeWindowDocument> =
  mongoose.models.DailyTimeWindow ||
  mongoose.model<IDailyTimeWindowDocument>('DailyTimeWindow', DailyTimeWindowSchema);

export default DailyTimeWindow;

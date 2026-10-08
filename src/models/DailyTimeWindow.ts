import mongoose, { Schema, Model } from 'mongoose';

export interface IDailyTimeWindowDocument {
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DailyTimeWindowSchema = new Schema<IDailyTimeWindowDocument>(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const DailyTimeWindow: Model<IDailyTimeWindowDocument> =
  mongoose.models.DailyTimeWindow ||
  mongoose.model<IDailyTimeWindowDocument>('DailyTimeWindow', DailyTimeWindowSchema);

export default DailyTimeWindow;

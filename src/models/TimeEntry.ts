import mongoose, { Schema, Model } from 'mongoose';

export interface ITimeEntryDocument {
  activity: string;
  category: string;
  date: string;
  duration: number; // minutes
  note?: string;
  createdAt: Date;
}

const TimeEntrySchema = new Schema<ITimeEntryDocument>(
  {
    activity: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true, index: true },
    duration: { type: Number, required: true },
    note: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const TimeEntry: Model<ITimeEntryDocument> =
  mongoose.models.TimeEntry || mongoose.model<ITimeEntryDocument>('TimeEntry', TimeEntrySchema);

export default TimeEntry;

import mongoose, { Schema, Model } from 'mongoose';

export interface IJournalEntryDocument {
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntryDocument>(
  {
    date: { type: String, required: true, index: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    mood: { type: Number, min: 1, max: 5, default: 3 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const JournalEntry: Model<IJournalEntryDocument> =
  mongoose.models.JournalEntry ||
  mongoose.model<IJournalEntryDocument>('JournalEntry', JournalEntrySchema);

export default JournalEntry;

import mongoose, { Schema, Model } from 'mongoose';

export interface ICategoryDocument {
  name: string;
  color: string;
  icon: string;
  order: number;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String, default: '#6B7280' },
    icon: { type: String, default: 'Circle' },
    order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);

export default Category;

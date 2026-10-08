import mongoose, { Schema, Model } from 'mongoose';

export interface ITaskDocument {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: Date;
  category: string;
  goalId?: mongoose.Types.ObjectId;
  estimatedMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    category: { type: String, default: 'Other' },
    goalId: { type: Schema.Types.ObjectId, ref: 'Goal' },
    estimatedMinutes: { type: Number },
  },
  { timestamps: true }
);

const Task: Model<ITaskDocument> =
  mongoose.models.Task || mongoose.model<ITaskDocument>('Task', TaskSchema);

export default Task;

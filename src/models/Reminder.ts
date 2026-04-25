import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
  title: string;
  time: string;
  isActive: boolean;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    time: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Reminder = mongoose.model<IReminder>('Reminder', ReminderSchema);

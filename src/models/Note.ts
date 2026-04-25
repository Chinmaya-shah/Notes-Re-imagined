import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    isPinned: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', NoteSchema);

import { Note } from '../models/Note';

export class NotesPresenter {
  static async getNotes(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const notes = await Note.find({ owner: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Note.countDocuments({ owner: userId });
    
    return {
      page,
      limit,
      total,
      count: notes.length,
      notes,
    };
  }

  static async getSingleNote(noteId: string, userId: string) {
    const note = await Note.findById(noteId);
    if (!note) {
      const error = new Error('Note not found'); (error as any).statusCode = 404; throw error;
    }
    if (note.owner.toString() !== userId.toString()) {
      const error = new Error('Access denied'); (error as any).statusCode = 403; throw error;
    }
    return note;
  }

  static async createNote(userId: string, title: string, content: string, tags: string[] = []) {
    return await Note.create({
      owner: userId,
      title,
      content,
      tags,
    });
  }

  static async updateNote(noteId: string, userId: string, updateData: Partial<{ title: string; content: string; tags: string[]; isPinned: boolean }>) {
    const note = await Note.findById(noteId);
    if (!note) {
      const error = new Error('Note not found'); (error as any).statusCode = 404; throw error;
    }
    if (note.owner.toString() !== userId.toString()) {
      const error = new Error('Access denied'); (error as any).statusCode = 403; throw error;
    }

    Object.assign(note, updateData);
    return await note.save();
  }

  static async deleteNote(noteId: string, userId: string) {
    const note = await Note.findById(noteId);
    if (!note) {
      const error = new Error('Note not found'); (error as any).statusCode = 404; throw error;
    }
    if (note.owner.toString() !== userId.toString()) {
      const error = new Error('Access denied'); (error as any).statusCode = 403; throw error;
    }

    await note.deleteOne();
    return { message: 'Note deleted successfully' };
  }
}

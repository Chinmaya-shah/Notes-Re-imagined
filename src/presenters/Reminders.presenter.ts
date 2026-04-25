import { Reminder } from '../models/Reminder';

export class RemindersPresenter {
  static async getReminders(userId: string) {
    return await Reminder.find({ owner: userId }).sort({ createdAt: -1 });
  }

  static async createReminder(userId: string, title: string, time: string) {
    return await Reminder.create({
      owner: userId,
      title,
      time,
    });
  }

  static async toggleReminder(reminderId: string, userId: string) {
    const reminder = await Reminder.findOne({ _id: reminderId, owner: userId });
    if (!reminder) {
      const error = new Error('Reminder not found'); (error as any).statusCode = 404; throw error;
    }
    reminder.isActive = !reminder.isActive;
    return await reminder.save();
  }

  static async deleteReminder(reminderId: string, userId: string) {
    const reminder = await Reminder.findOneAndDelete({ _id: reminderId, owner: userId });
    if (!reminder) {
      const error = new Error('Reminder not found'); (error as any).statusCode = 404; throw error;
    }
    return { id: reminderId };
  }
}

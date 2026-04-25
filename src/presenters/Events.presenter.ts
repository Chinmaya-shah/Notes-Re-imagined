import { Event } from '../models/Event';

export class EventsPresenter {
  static async getEvents(userId: string) {
    return await Event.find({ owner: userId }).sort({ date: 1 });
  }

  static async createEvent(userId: string, title: string, date: Date, time: string, type: string) {
    return await Event.create({
      owner: userId,
      title,
      date,
      time,
      type,
    });
  }

  static async deleteEvent(eventId: string, userId: string) {
    const event = await Event.findOneAndDelete({ _id: eventId, owner: userId });
    if (!event) {
      const error = new Error('Event not found'); (error as any).statusCode = 404; throw error;
    }
    return { id: eventId };
  }
}

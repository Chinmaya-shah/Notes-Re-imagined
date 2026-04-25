import { Task } from '../models/Task';

export class TasksPresenter {
  static async getTasks(userId: string) {
    return await Task.find({ owner: userId }).sort({ createdAt: -1 });
  }

  static async createTask(userId: string, title: string, description: string, dueDate?: Date) {
    return await Task.create({
      owner: userId,
      title,
      description,
      dueDate,
    });
  }

  static async updateTask(taskId: string, userId: string, title: string, description: string) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, owner: userId },
      { title, description },
      { new: true, runValidators: true }
    );
    if (!task) {
      const error = new Error('Task not found'); (error as any).statusCode = 404; throw error;
    }
    return task;
  }

  static async toggleTaskCompletion(taskId: string, userId: string) {
    const task = await Task.findOne({ _id: taskId, owner: userId });
    if (!task) {
      const error = new Error('Task not found'); (error as any).statusCode = 404; throw error;
    }
    task.isCompleted = !task.isCompleted;
    return await task.save();
  }

  static async deleteTask(taskId: string, userId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, owner: userId });
    if (!task) {
      const error = new Error('Task not found'); (error as any).statusCode = 404; throw error;
    }
    return { id: taskId };
  }
}

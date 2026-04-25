import { Router, Response, NextFunction } from 'express';
import { TasksPresenter } from '../presenters/Tasks.presenter';
import { protect, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await TasksPresenter.getTasks(req.user._id);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) { next(error); }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = await TasksPresenter.createTask(req.user._id, title, description, dueDate);
    res.status(201).json({ success: true, data: task });
  } catch (error) { next(error); }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const task = await TasksPresenter.updateTask(req.params.id, req.user._id, title, description);
    res.status(200).json({ success: true, data: task });
  } catch (error) { next(error); }
});

router.patch('/:id/toggle', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const task = await TasksPresenter.toggleTaskCompletion(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: task });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await TasksPresenter.deleteTask(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
});

export default router;

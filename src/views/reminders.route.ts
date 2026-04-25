import { Router, Response, NextFunction } from 'express';
import { RemindersPresenter } from '../presenters/Reminders.presenter';
import { protect, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reminders = await RemindersPresenter.getReminders(req.user._id);
    res.status(200).json({ success: true, data: reminders });
  } catch (error) { next(error); }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, time } = req.body;
    const reminder = await RemindersPresenter.createReminder(req.user._id, title, time);
    res.status(201).json({ success: true, data: reminder });
  } catch (error) { next(error); }
});

router.patch('/:id/toggle', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reminder = await RemindersPresenter.toggleReminder(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: reminder });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await RemindersPresenter.deleteReminder(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
});

export default router;

import { Router, Response, NextFunction } from 'express';
import { EventsPresenter } from '../presenters/Events.presenter';
import { protect, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
router.use(protect);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const events = await EventsPresenter.getEvents(req.user._id);
    res.status(200).json({ success: true, data: events });
  } catch (error) { next(error); }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, date, time, type } = req.body;
    const event = await EventsPresenter.createEvent(req.user._id, title, date, time, type);
    res.status(201).json({ success: true, data: event });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await EventsPresenter.deleteEvent(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) { next(error); }
});

export default router;

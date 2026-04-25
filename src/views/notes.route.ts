import { Router, Response, NextFunction } from 'express';
import { NotesPresenter } from '../presenters/Notes.presenter';
import { protect, AuthRequest } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

const createNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isPinned: z.boolean().optional(),
  }),
});

// All note routes require authentication
router.use(protect);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notes = await NotesPresenter.getNotes(req.user._id);
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(createNoteSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, content, tags } = req.body;
    const note = await NotesPresenter.createNote(req.user._id, title, content, tags);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(updateNoteSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await NotesPresenter.updateNote((req.params as any).id, req.user._id, req.body);
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await NotesPresenter.deleteNote((req.params as any).id, req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;

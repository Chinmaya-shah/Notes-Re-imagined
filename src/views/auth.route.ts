import { Router, Request, Response, NextFunction } from 'express';
import { AuthPresenter } from '../presenters/Auth.presenter';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await AuthPresenter.registerUser(name, email, password);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await AuthPresenter.loginUser(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export default router;

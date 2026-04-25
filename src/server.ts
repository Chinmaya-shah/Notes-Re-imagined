import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './views/auth.route';
import notesRoutes from './views/notes.route';
import tasksRoutes from './views/tasks.route';
import eventsRoutes from './views/events.route';
import remindersRoutes from './views/reminders.route';

dotenv.config();

const app = express();

// 1. CORS must be at the very top
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://sanctuary-nextjs.vercel.app'
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
}));

// 3. Other middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(express.json());

// Connect to Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/reminders', remindersRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Sanctuary Backend is running' });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

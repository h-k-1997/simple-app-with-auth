import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.js';
import meRouter from './routes/me.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/auth', authRouter);
app.use('/me', meRouter);

// Fallback 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Start server
const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));

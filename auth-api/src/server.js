import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouter from './routes/auth.js';
import meRouter from './routes/me.js';

dotenv.config();

const app = express();

// CORS: single rule. Local fallback if FRONTEND_URL is missing.
const ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: ORIGIN, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/me', meRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));

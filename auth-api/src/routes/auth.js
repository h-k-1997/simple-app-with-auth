import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

import { signAccess, signRefresh, verifyRefresh } from '../lib/tokens.js';
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from '../lib/cookies.js';

const prisma = new PrismaClient();
const router = express.Router();
const SALT_ROUNDS = 12;

/**
 * POST /auth/register
 * Body: { email, password, name? }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ error: 'email already registered' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({ data: { email, password: hash, name } });

    const access = signAccess(user.id);
    const refresh = signRefresh(user.id);
    setAuthCookies(res, access, refresh);

    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const access = signAccess(user.id);
    const refresh = signRefresh(user.id);
    setAuthCookies(res, access, refresh);

    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /auth/refresh
 * Uses refresh token cookie; rotates tokens.
 */
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) return res.status(401).json({ error: 'missing refresh token' });

    const { sub: userId } = verifyRefresh(token);

    const access = signAccess(userId);
    const refresh = signRefresh(userId); // simple rotation
    setAuthCookies(res, access, refresh);

    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: 'invalid/expired refresh token' });
  }
});

/**
 * POST /auth/logout
 * Clears auth cookies.
 */
router.post('/logout', async (_req, res) => {
  clearAuthCookies(res);
  return res.json({ ok: true });
});

export default router;

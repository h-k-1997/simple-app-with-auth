import { ACCESS_COOKIE } from '../lib/cookies.js';
import { verifyAccess } from '../lib/tokens.js';

export default function requireAuth(req, res, next) {
  // allow cookie or Bearer token (useful for tests/tools)
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.[ACCESS_COOKIE] || bearer;

  if (!token) return res.status(401).json({ error: 'Unauthenticated', code: 'NO_TOKEN' });

  try {
    const payload = verifyAccess(token);
    req.userId = payload.sub;
    return next();
  } catch (e) {
    const code = e?.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
    return res.status(401).json({ error: 'Unauthenticated', code });
  }
}

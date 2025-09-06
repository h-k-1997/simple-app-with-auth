// src/lib/cookies.js
const isProd = process.env.NODE_ENV === 'production';
const sameSite = isProd ? 'none' : 'lax'; // cross-site needs 'none' in prod
const secure = isProd ? true : false; // 'secure' required when SameSite=None

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

const accMs = (Number(process.env.ACCESS_TOKEN_TTL_SEC) || 900) * 1000; // 15m default
const refMs = (Number(process.env.REFRESH_TOKEN_TTL_SEC) || 1209600) * 1000; // 14d default

export const setAuthCookies = (res, access, refresh) => {
  res.cookie(ACCESS_COOKIE, access, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: accMs,
  });
  res.cookie(REFRESH_COOKIE, refresh, {
    httpOnly: true,
    secure,
    sameSite,
    path: '/auth/refresh',
    maxAge: refMs,
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE, { path: '/' });
  res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
};

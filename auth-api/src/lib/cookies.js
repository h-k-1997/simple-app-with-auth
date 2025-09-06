const isProd = process.env.NODE_ENV === 'production';
export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export const setAuthCookies = (res, access, refresh) => {
  res.cookie(ACCESS_COOKIE, access, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: Number(process.env.ACCESS_TOKEN_TTL_SEC) * 1000,
  });
  res.cookie(REFRESH_COOKIE, refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: Number(process.env.REFRESH_TOKEN_TTL_SEC) * 1000,
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE, { path: '/' });
  res.clearCookie(REFRESH_COOKIE, { path: '/auth/refresh' });
};

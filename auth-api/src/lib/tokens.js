import jwt from 'jsonwebtoken';

const ISS = 'auth-api'; // issuer
const AUD = 'auth-client'; // audience

const ttl = (v, d) => Number(v) || d;

const sign = (payload, secret, seconds) =>
  jwt.sign(payload, secret, {
    expiresIn: ttl(seconds, 900),
    issuer: ISS,
    audience: AUD,
  });

export const signAccess = (userId) =>
  sign(
    { sub: userId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    process.env.ACCESS_TOKEN_TTL_SEC
  );

export const signRefresh = (userId) =>
  sign(
    { sub: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    process.env.REFRESH_TOKEN_TTL_SEC
  );

export const verifyAccess = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, { issuer: ISS, audience: AUD });

export const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, { issuer: ISS, audience: AUD });

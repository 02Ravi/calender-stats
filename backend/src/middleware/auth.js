import jwt from 'jsonwebtoken';

const COOKIE_NAME = process.env.COOKIE_NAME || 'calstats_token';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

export function signRefreshTokenCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    domain: COOKIE_DOMAIN,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    domain: COOKIE_DOMAIN,
  });
}

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}


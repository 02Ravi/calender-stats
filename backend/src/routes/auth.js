import express from 'express';
import { google } from 'googleapis';
import { createOAuthClient, generateAuthUrl, getTokensFromCode } from '../config/google.js';
import { signRefreshTokenCookie, clearAuthCookie } from '../middleware/auth.js';

const router = express.Router();

router.get('/google', (_req, res) => {
  const url = generateAuthUrl();
  return res.redirect(url);
});

router.get('/google/callback', async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }

    const tokens = await getTokensFromCode(code);
    const oauth2 = createOAuthClient();
    oauth2.setCredentials(tokens);

    const oauth2Api = google.oauth2({ version: 'v2', auth: oauth2 });
    const { data: profile } = await oauth2Api.userinfo.get();

    const payload = {
      sub: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      refresh_token: tokens.refresh_token,
    };

    signRefreshTokenCookie(res, payload);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(frontendUrl + '/dashboard');
  } catch (err) {
    next(err);
  }
});

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

export default router;


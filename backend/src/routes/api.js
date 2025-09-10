import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getAuthorizedClientFromReq, fetchCalendarEvents } from '../services/calendar.js';
import { computeStatistics } from '../utils/stats.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  const { sub, email, name, picture } = req.user;
  res.json({ sub, email, name, picture });
});

router.get('/events', requireAuth, async (req, res, next) => {
  try {
    const days = Number(req.query.days || 30);
    const timeMax = new Date();
    const timeMin = new Date(timeMax.getTime() - days * 24 * 60 * 60 * 1000);

    const auth = await getAuthorizedClientFromReq(req);
    const events = await fetchCalendarEvents(auth, timeMin, timeMax);
    res.json({ events });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const days = Number(req.query.days || 30);
    const timeMax = new Date();
    const timeMin = new Date(timeMax.getTime() - days * 24 * 60 * 60 * 1000);

    const auth = await getAuthorizedClientFromReq(req);
    const events = await fetchCalendarEvents(auth, timeMin, timeMax);
    const stats = computeStatistics(events);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;


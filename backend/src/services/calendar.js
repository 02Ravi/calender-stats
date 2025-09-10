import { google } from 'googleapis';
import { createOAuthClient } from '../config/google.js';

export async function getAuthorizedClientFromReq(req) {
  const user = req.user;
  if (!user || !user.refresh_token) {
    const error = new Error('Missing refresh token');
    error.status = 401;
    throw error;
  }
  const client = createOAuthClient();
  client.setCredentials({ refresh_token: user.refresh_token });
  return client;
}

export async function fetchCalendarEvents(auth, timeMin, timeMax) {
  const calendar = google.calendar({ version: 'v3', auth });
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 2500,
  });
  const events = response.data.items || [];
  return events.filter((e) => !e.status || e.status !== 'cancelled');
}


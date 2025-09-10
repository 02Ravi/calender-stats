import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';

const app = express();

// Ensure correct secure cookie behavior behind proxies (Render/Heroku)
app.set('trust proxy', 1);

const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const FRONTEND_URLS = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Allow a single origin via FRONTEND_URL or multiple via FRONTEND_URLS (comma-separated)
const allowedOrigins = FRONTEND_URLS.length > 0 ? FRONTEND_URLS : [FRONTEND_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests or same-origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS: ' + origin));
    },
    credentials: true,
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV });
});

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});


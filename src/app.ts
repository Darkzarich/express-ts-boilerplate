import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import { env } from './configs/env.config.ts';

const app = express();

// Don't advertise the framework in response headers
app.disable('x-powered-by');

// Allowed origins come from CORS_ORIGIN; restrict it for production use
app.use(cors({ origin: env.CORS_ORIGIN }));

// Parse JSON and URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.get('/test', (req, res) => {
  res.json({
    text: 'testing string',
  });
});

// Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Express 5 forwards rejected promises from async handlers here as well
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number(err?.status ?? err?.statusCode) || 500;

  if (status >= 500) {
    console.error(err);
  }

  // Never leak internal error details for server errors
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.message,
  });
};

app.use(errorHandler);

export default app;

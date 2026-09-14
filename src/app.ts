import express from 'express';
import cors from 'cors';
import type { Env } from './configs/env.config.ts';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.ts';

export function createApp(config: Env) {
  const app = express();

  // Don't advertise the framework in response headers
  app.disable('x-powered-by');

  // Allowed origins come from CORS_ORIGIN; restrict it for production use
  app.use(cors({ origin: config.CORS_ORIGIN }));

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

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

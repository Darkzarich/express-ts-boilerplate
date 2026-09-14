import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import type { Env } from './configs/env.config.ts';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware.ts';

export function createApp(config: Env) {
  const app = express();

  app.set('trust proxy', config.TRUST_PROXY);

  // Sets security-related headers and removes X-Powered-By
  app.use(helmet());

  if (config.RATE_LIMIT_MAX > 0) {
    app.use(
      rateLimit({
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        limit: config.RATE_LIMIT_MAX,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
      }),
    );
  }

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

import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import {
  errorHandler,
  notFoundHandler,
} from '../../src/middlewares/error.middleware.ts';

function createTestApp() {
  const app = express();

  app.get('/async-failure', async () => {
    throw new Error('database password is hunter2');
  });

  app.get('/client-error', () => {
    throw Object.assign(new Error('Bad input'), { status: 422 });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

describe('error middleware', () => {
  it('should hide internal details of server errors', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const res = await request(createTestApp()).get('/async-failure');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
    expect(consoleError).toHaveBeenCalledOnce();

    consoleError.mockRestore();
  });

  it('should expose the message and status of client errors', async () => {
    const res = await request(createTestApp()).get('/client-error');

    expect(res.status).toBe(422);
    expect(res.body).toEqual({ error: 'Bad input' });
  });
});

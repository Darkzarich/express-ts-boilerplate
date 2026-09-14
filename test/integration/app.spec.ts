import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.ts';
import { parseEnv } from '../../src/configs/env.config.ts';

const app = createApp(parseEnv({}));

describe('Test route', () => {
  it('[GET: /test] should return test string', async () => {
    const res = await request(app).get('/test');

    expect(res.status).toBe(200);
    expect(res.body.text).toEqual('testing string');
  });

  it('should not expose the X-Powered-By header', async () => {
    const res = await request(app).get('/');

    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('should set security headers', async () => {
    const res = await request(app).get('/');

    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not Found' });
  });

  it('should return 400 for malformed JSON bodies', async () => {
    const res = await request(app)
      .post('/test')
      .set('Content-Type', 'application/json')
      .send('{ invalid');

    expect(res.status).toBe(400);
  });
});

describe('Rate limiting', () => {
  it('should reject requests over the limit', async () => {
    const limitedApp = createApp(parseEnv({ RATE_LIMIT_MAX: '2' }));

    await request(limitedApp).get('/test').expect(200);
    await request(limitedApp).get('/test').expect(200);
    const res = await request(limitedApp).get('/test');

    expect(res.status).toBe(429);
    expect(res.headers['ratelimit-policy']).toBeDefined();
  });

  it('should be disabled when RATE_LIMIT_MAX is 0', async () => {
    const unlimitedApp = createApp(parseEnv({ RATE_LIMIT_MAX: '0' }));

    const res = await request(unlimitedApp).get('/test');

    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-policy']).toBeUndefined();
  });
});

describe('Health check', () => {
  it('should respond with ok and bypass rate limiting', async () => {
    const limitedApp = createApp(parseEnv({ RATE_LIMIT_MAX: '1' }));

    const responses = await Promise.all(
      Array.from({ length: 3 }, () => request(limitedApp).get('/health')),
    );

    for (const res of responses) {
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    }

    await request(limitedApp).get('/test').expect(200);
    await request(limitedApp).get('/test').expect(429);
  });
});

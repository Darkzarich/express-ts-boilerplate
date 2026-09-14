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

import request from 'supertest';
import app from '../../src/app';

describe('Test route', () => {
  it('[GET: /test] should return test string', async () => {
    const res = await request(app).get('/test');

    expect(res.body.text).toEqual('testing string');
  });
});

import { describe, expect, it } from 'vitest';
import { parseEnv } from '../../src/configs/env.config.ts';

describe('parseEnv', () => {
  it('should apply defaults when variables are not set', () => {
    expect(parseEnv({})).toEqual({
      NODE_ENV: 'development',
      HOST: '0.0.0.0',
      PORT: 3000,
      CORS_ORIGIN: '*',
    });
  });

  it('should coerce PORT and split CORS_ORIGIN', () => {
    const env = parseEnv({
      PORT: '8080',
      CORS_ORIGIN: 'https://a.example, https://b.example',
    });

    expect(env.PORT).toBe(8080);
    expect(env.CORS_ORIGIN).toEqual(['https://a.example', 'https://b.example']);
  });

  it('should throw a readable error for invalid values', () => {
    expect(() => parseEnv({ PORT: 'abc', NODE_ENV: 'staging' })).toThrow(
      expect.objectContaining({
        message: expect.stringMatching(
          /^Invalid environment variables:(?=[\s\S]*at PORT)(?=[\s\S]*at NODE_ENV)/,
        ),
      }),
    );
  });
});

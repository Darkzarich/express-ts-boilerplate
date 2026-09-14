import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  // Comma-separated list of allowed origins, or "*" to allow any origin
  CORS_ORIGIN: z
    .string()
    .default('*')
    .transform((value) =>
      value === '*' ? '*' : value.split(',').map((origin) => origin.trim()),
    ),
  // Number of reverse proxies in front of the app (0 when exposed directly).
  // Needed so rate limiting sees the real client IP.
  TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  // Max requests per client IP per window; 0 disables rate limiting
  RATE_LIMIT_MAX: z.coerce.number().int().min(0).default(100),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`,
    );
  }

  return result.data;
}

export const env = parseEnv(process.env);

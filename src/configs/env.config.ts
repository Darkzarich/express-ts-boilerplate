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

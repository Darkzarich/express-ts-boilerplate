import { createApp } from './src/app.ts';
import { env } from './src/configs/env.config.ts';

const SHUTDOWN_TIMEOUT_MS = 10_000;

const app = createApp(env);

const server = app.listen(env.PORT, env.HOST, (error) => {
  // Express 5 reports listen errors (e.g. EADDRINUSE) via the callback
  if (error) {
    throw error;
  }

  console.log(`[server]: Server is running at http://localhost:${env.PORT}`);
});

function shutdown(signal: NodeJS.Signals) {
  console.log(`[server]: ${signal} received, shutting down gracefully`);

  // Stop accepting new connections and wait for in-flight requests to finish
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    process.exit(0);
  });

  // Close keep-alive connections that have no request in progress
  server.closeIdleConnections();

  setTimeout(() => {
    console.error('[server]: Shutdown timed out, forcing exit');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS).unref();
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);

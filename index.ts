import app from './src/app.ts';
import { env } from './src/configs/env.config.ts';

app.listen(env.PORT, env.HOST, (error) => {
  // Express 5 reports listen errors (e.g. EADDRINUSE) via the callback
  if (error) {
    throw error;
  }

  console.log(`[server]: Server is running at http://localhost:${env.PORT}`);
});

import app from './src/app';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, (error) => {
  // Express 5 reports listen errors (e.g. EADDRINUSE) via the callback
  if (error) {
    throw error;
  }

  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

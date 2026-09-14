import type { ErrorRequestHandler, RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: 'Not Found' });
};

// Express 5 forwards rejected promises from async handlers here as well
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number(err?.status ?? err?.statusCode) || 500;

  if (status >= 500) {
    console.error(err);
  }

  // Never leak internal error details for server errors
  res.status(status).json({
    error: status >= 500 ? 'Internal Server Error' : err.message,
  });
};

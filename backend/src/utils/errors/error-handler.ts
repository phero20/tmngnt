import { Context } from 'hono';
import { ZodError } from 'zod';
import { HttpError } from './http-error';

export function globalErrorHandler(err: unknown, c: Context) {
  // 1️⃣ Zod validation errors → 400
  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: 'Invalid request data',
        errors: err.flatten().fieldErrors,
      },
      400
    );
  }

  // 2️⃣ Controlled HTTP errors
  if (err instanceof HttpError) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status
    );
  }

  // 3️⃣ Database / unknown errors → 500 (DO NOT LEAK INFO)
  console.error('Unhandled error:', err);

  return c.json(
    {
      success: false,
      message: 'Internal server error',
    },
    500
  );
}

import { Context } from 'hono';
import { ZodError } from 'zod';
import { HTTPException } from 'hono/http-exception';
import { HttpError } from './http-error';

export async function globalErrorHandler(err: Error | unknown, c: Context) {
  // 1️⃣ Zod validation errors → 400
  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        message: 'Validation failed',
        errors: err.flatten().fieldErrors,
      },
      400
    );
  }

  // 2️⃣ Controlled HTTP errors (Our Custom Class)
  if (err instanceof HttpError) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status
    );
  }

  // 3️⃣ Hono Internal HTTP Exceptions (e.g. 404 Not Found, 401 Unauthorized from generic handlers)
  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
      },
      err.status
    );
  }

  // 4️⃣ Database / unknown errors → 500 (DO NOT LEAK INFO)
  console.error('Unhandled error:', err);

  // In production, valid DB constraints errors (like unique email) should be caught in Service/Repo
  // and thrown as HttpError(409).
  // Here we just return 500 to be safe.

  return c.json(
    {
      success: false,
      message: 'Internal server error',
    },
    500
  );
}

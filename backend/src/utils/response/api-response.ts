import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Standard success response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 200 OK - Standard success response
 */
export const ok = <T>(c: Context, data: T, message: string = 'Success') => {
  return c.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    200
  );
};

/**
 * 201 Created - Resource created successfully
 */
export const created = <T>(
  c: Context,
  data: T,
  message: string = 'Resource created successfully'
) => {
  return c.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    201
  );
};

/**
 * 202 Accepted - Request accepted for processing (async)
 */
export const accepted = <T>(
  c: Context,
  data: T,
  message: string = 'Request accepted'
) => {
  return c.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    202
  );
};

/**
 * 204 No Content - Successful request, no body returned
 */
export const noContent = (c: Context) => {
  return c.body(null, 204);
};

/**
 * Custom JSON Response for edge cases
 */
export const json = <T>(
  c: Context,
  data: T,
  message: string,
  statusCode: ContentfulStatusCode
) => {
  return c.json(
    {
      success: true,
      message,
      data,
    } as ApiResponse<T>,
    statusCode
  );
};

/**
 * Standard Paginated Response
 */
export const paginated = <T>(
  c: Context,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = 'Success'
) => {
  const totalPages = Math.ceil(total / limit);

  return c.json(
    {
      success: true,
      message,
      data,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
      },
    } as ApiResponse<T[]>,
    200
  );
};

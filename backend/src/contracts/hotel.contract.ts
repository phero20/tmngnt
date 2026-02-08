import { createRoute, z } from '@hono/zod-openapi';
import {
  CreateHotelSchema,
  UpdateHotelSchema,
  ListHotelsQuerySchema,
  HotelResponseSchema,
} from '../schemas/hotel.schema';
import { ApiResponseSchema } from '../utils/response/response.schema';

// List Hotels
export const listHotelsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Hotels'],
  summary: 'List Hotels',
  request: {
    query: ListHotelsQuerySchema,
  },
  responses: {
    200: {
      description: 'List of hotels',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.array(HotelResponseSchema)),
        },
      },
    },
  },
});

// Get Hotel by ID
export const getHotelRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Hotels'],
  summary: 'Get Hotel Details',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'Hotel details',
      content: {
        'application/json': {
          schema: ApiResponseSchema(HotelResponseSchema),
        },
      },
    },
    404: { description: 'Hotel not found' },
  },
});

// Create Hotel
export const createHotelRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Hotels'],
  summary: 'Create a new Hotel',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateHotelSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Hotel created successfully',
      content: {
        'application/json': {
          schema: ApiResponseSchema(HotelResponseSchema),
        },
      },
    },
    401: { description: 'Unauthorized' },
  },
});

// Update Hotel (Owner Only)
export const updateHotelRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Hotels'],
  summary: 'Update Hotel',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': {
          schema: UpdateHotelSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Hotel updated',
      content: {
        'application/json': {
          schema: ApiResponseSchema(HotelResponseSchema),
        },
      },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not Owner)' },
    404: { description: 'Hotel not found' },
  },
});

// Delete Hotel (Owner Only)
export const deleteHotelRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Hotels'],
  summary: 'Delete Hotel',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { description: 'Hotel deleted (soft delete)' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not Owner)' },
    404: { description: 'Hotel not found' },
  },
});

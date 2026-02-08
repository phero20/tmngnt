import { createRoute, z } from '@hono/zod-openapi';
import {
  CreateAmenitySchema,
  UpdateAmenitySchema,
  AmenityResponseSchema,
} from '../schemas/amenity.schema';
import { ApiResponseSchema } from '../utils/response/response.schema';
import { ErrorResponseSchema } from '../utils/response/response.schema';

// List All Amenities
export const listAmenitiesRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Amenities'],
  summary: 'List All Amenities',
  responses: {
    200: {
      description: 'List of amenities',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.array(AmenityResponseSchema)),
        },
      },
    },
  },
});

// Create Amenity (Admin Only)
export const createAmenityRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Amenities'],
  summary: 'Create a new Amenity',
  request: {
    body: {
      content: {
        'application/json': { schema: CreateAmenitySchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Amenity created successfully',
      content: {
        'application/json': {
          schema: ApiResponseSchema(AmenityResponseSchema),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    403: {
      description: 'Forbidden (Admin Only)',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// Update Amenity (Admin Only)
export const updateAmenityRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Amenities'],
  summary: 'Update Amenity',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: UpdateAmenitySchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Amenity updated',
      content: {
        'application/json': {
          schema: ApiResponseSchema(AmenityResponseSchema),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Amenity not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

// Delete Amenity (Admin Only)
export const deleteAmenityRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Amenities'],
  summary: 'Delete Amenity',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'Amenity deleted',
      content: {
        'application/json': {
          schema: ApiResponseSchema(AmenityResponseSchema),
        },
      },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
    404: {
      description: 'Amenity not found',
      content: { 'application/json': { schema: ErrorResponseSchema } },
    },
  },
});

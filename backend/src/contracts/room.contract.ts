import { createRoute, z } from '@hono/zod-openapi';
import {
  CreateRoomSchema,
  UpdateRoomSchema,
  RoomResponseSchema,
} from '../schemas/hotel.schema';
import { ApiResponseSchema } from '../utils/response/response.schema';

// List Rooms for Hotel
export const listRoomsRoute = createRoute({
  method: 'get',
  path: '/{id}/rooms',
  tags: ['Rooms'],
  summary: 'List Rooms for Hotel',
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'List of rooms',
      content: {
        'application/json': {
          schema: ApiResponseSchema(z.array(RoomResponseSchema)),
        },
      },
    },
  },
});

// Get Room Details
export const getRoomRoute = createRoute({
  method: 'get',
  path: '/{id}/rooms/{roomId}',
  tags: ['Rooms'],
  summary: 'Get Room Details',
  request: {
    params: z.object({
      id: z.string().uuid(),
      roomId: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Room details',
      content: {
        'application/json': {
          schema: ApiResponseSchema(RoomResponseSchema),
        },
      },
    },
    404: { description: 'Room not found' },
  },
});

// Create Room for Hotel
export const createRoomRoute = createRoute({
  method: 'post',
  path: '/{id}/rooms',
  tags: ['Rooms'],
  summary: 'Add Room to Hotel',
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': {
          schema: CreateRoomSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Room created',
      content: {
        'application/json': {
          schema: ApiResponseSchema(RoomResponseSchema),
        },
      },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not Owner)' },
    404: { description: 'Hotel not found' },
  },
});

// Update Room
export const updateRoomRoute = createRoute({
  method: 'patch',
  path: '/{id}/rooms/{roomId}',
  tags: ['Rooms'],
  summary: 'Update Room',
  request: {
    params: z.object({
      id: z.string().uuid(),
      roomId: z.string().uuid(),
    }),
    body: {
      content: {
        'application/json': {
          schema: UpdateRoomSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Room updated',
      content: {
        'application/json': {
          schema: ApiResponseSchema(RoomResponseSchema),
        },
      },
    },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not Owner)' },
    404: { description: 'Room not found' },
  },
});

// Delete Room
export const deleteRoomRoute = createRoute({
  method: 'delete',
  path: '/{id}/rooms/{roomId}',
  tags: ['Rooms'],
  summary: 'Delete Room',
  request: {
    params: z.object({
      id: z.string().uuid(),
      roomId: z.string().uuid(),
    }),
  },
  responses: {
    200: { description: 'Room deleted (soft delete)' },
    401: { description: 'Unauthorized' },
    403: { description: 'Forbidden (Not Owner)' },
    404: { description: 'Room not found' },
  },
});

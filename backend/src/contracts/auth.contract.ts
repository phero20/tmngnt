import { createRoute } from '@hono/zod-openapi';
import {
  UserSchema,
  UpdateUserSchema,
  ErrorSchema,
  SuccessSchema,
} from '../schemas/auth.schema';

export const getMeRoute = createRoute({
  method: 'get',
  path: '/api/me',
  tags: ['Auth'],
  summary: 'Get Current User Profile',
  responses: {
    200: {
      description: 'Successfully retrieved user profile',
      content: { 'application/json': { schema: SuccessSchema(UserSchema) } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

export const updateMeRoute = createRoute({
  method: 'patch',
  path: '/api/me',
  tags: ['Auth'],
  summary: 'Update User Profile',
  request: {
    body: {
      content: {
        'application/json': { schema: UpdateUserSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile updated successfully',
      content: { 'application/json': { schema: SuccessSchema(UserSchema) } },
    },
    404: {
      description: 'User not found',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

export const deleteMeRoute = createRoute({
  method: 'delete',
  path: '/api/me',
  tags: ['Auth'],
  summary: 'Delete Account',
  responses: {
    200: {
      description: 'Account deleted successfully',
      content: { 'application/json': { schema: SuccessSchema(UserSchema) } },
    },
    401: {
      description: 'Unauthorized',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

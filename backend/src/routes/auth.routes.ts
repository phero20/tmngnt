import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { AppBindings } from '../types/hono.types';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  UserSchema,
  UpdateUserSchema,
  ErrorSchema,
  SuccessSchema,
} from '../schemas/auth.schema';

const authRoutes = new OpenAPIHono<AppBindings>();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRoutes.on(['POST', 'GET'], '/api/auth/**', (c) =>
  authController.handleAuth(c)
);

authRoutes.use('/api/me', authMiddleware);

authRoutes.openapi(
  createRoute({
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
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => authController.getMe(c) as any
);

authRoutes.openapi(
  createRoute({
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
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => authController.updateMe(c) as any
);

authRoutes.openapi(
  createRoute({
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
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => authController.deleteMe(c) as any
);

export default authRoutes;

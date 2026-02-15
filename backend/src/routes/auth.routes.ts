import { OpenAPIHono } from '@hono/zod-openapi';
import { AppBindings } from '../types/hono.types';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getMeRoute,
  updateMeRoute,
  deleteMeRoute,
} from '../contracts/auth.contract';

const authRoutes = new OpenAPIHono<AppBindings>();
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// Better Auth handler - mounted at /auth in the parent /api router
authRoutes.all('/auth/*', (c) => authController.handleAuth(c));

// Me routes - mounted at /me in the parent /api router
authRoutes.use('/me', authMiddleware);

authRoutes.openapi(
  getMeRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => authController.getMe(c) as any
);

authRoutes.openapi(
  updateMeRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => authController.updateMe(c) as any
);

authRoutes.openapi(
  deleteMeRoute,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (c) => authController.deleteMe(c) as any
);

export default authRoutes;

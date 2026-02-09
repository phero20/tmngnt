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

authRoutes.on(['POST', 'GET'], '/api/auth/**', (c) =>
  authController.handleAuth(c)
);

authRoutes.use('/api/me', authMiddleware);

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

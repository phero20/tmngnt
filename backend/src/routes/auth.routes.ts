import { Hono } from 'hono';
import { AppBindings } from '../types/hono.types';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRoutes = new Hono<AppBindings>();
const authController = new AuthController();

// Define Better Auth Handler on recursive path
authRoutes.on(['POST', 'GET'], '/api/auth/*', (c) =>
  authController.handleAuth(c)
);

// Define Protected Route
authRoutes.get('/me', authMiddleware, (c) => authController.getMe(c));

export default authRoutes;

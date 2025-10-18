import { Hono } from 'hono';
import authRoutes from './auth.routes';

const app = new Hono();

app.route('/', authRoutes);

export default app;

import { Hono } from 'hono';
import { globalErrorHandler } from './utils/errors/error-handler';
import authRoutes from './routes/auth.routes';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());
app.onError(globalErrorHandler);

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/', authRoutes);

app.get('/', (c) => c.text('Hotel Management API'));

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
  hostname: '0.0.0.0',
};

import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { globalErrorHandler } from './utils/errors/error-handler';
import { envConfig } from './config/env.config';
import authRoutes from './routes/auth.routes';
import { logger } from 'hono/logger';

const app = new OpenAPIHono();

app.use('*', logger());
app.onError(globalErrorHandler);

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/', authRoutes);

app.get('/', (c) => c.text('Hotel Management API'));

// Documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hotel Management API',
  },
});

app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/doc',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
);

export { app };
export default {
  port: envConfig.get('PORT'),
  fetch: app.fetch,
  hostname: '0.0.0.0',
};

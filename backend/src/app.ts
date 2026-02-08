import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { globalErrorHandler } from './utils/errors/error-handler';
import routes from './routes';
import { logger } from 'hono/logger';

const app = new OpenAPIHono();

// Middleware
app.use('*', logger());
app.onError(globalErrorHandler);

// Health Check
app.get('/health', (c) => c.json({ status: 'ok' }));

// All Routes
app.route('/', routes);

app.get('/', (c) => c.text('Hotel Management API'));

// OpenAPI Documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hotel Management API',
  },
});

// Main API Reference
app.get(
  '/reference',
  apiReference({
    pageTitle: 'Hotel Management API',
    spec: {
      url: '/doc',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
);

// Auth API Reference (Better Auth)
app.get(
  '/reference/auth',
  apiReference({
    pageTitle: 'Authentication API',
    spec: {
      url: '/api/auth/openapi',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
);

export default app;

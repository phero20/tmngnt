import { envConfig } from './config/env.config';
import app from './app';

export default {
  port: envConfig.get('PORT'),
  fetch: app.fetch,
  hostname: '0.0.0.0',
};

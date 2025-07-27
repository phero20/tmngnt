import { drizzle } from 'drizzle-orm/neon-http';
import { envConfig } from '../config/env.config';

export const db = drizzle(envConfig.get("DATABASE_URL"));


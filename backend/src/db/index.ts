import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import { envConfig } from '../config/env.config';
import * as schema from './schema';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: envConfig.get('DATABASE_URL') });

export const db = drizzle(pool, { schema });

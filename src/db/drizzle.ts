import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// config({ path: ".env" });

const client = postgres(process.env.VERCEL_DATABASE_URL!, {prepare: false});
const db = drizzle(client, { schema });

export default db;
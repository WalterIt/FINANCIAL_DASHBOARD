import { drizzle} from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL!, {prepare: false});
export const db = drizzle(client, { schema });





// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { NextAuthAdapter } from 'next-auth/adapters';
// import { AdapterAccountType, AdapterUser } from 'next-auth/adapters';
// import * as schema from '@/db/schema';

// const connectionString = process.env.DATABASE_URL!; // Securely store credentials in environment variables
// const pool = postgres(connectionString, { max: 1 });

// export const db = drizzle(pool, { schema });

// export const authAdapter: NextAuthAdapter<AdapterAccountType, AdapterUser> = (options) => {
//   return {
//     async createUser(user) {
//       // Hash password before inserting
//       user.password = await hashPassword(user.password); // Implement secure password hashing
//       await db.query.insertInto(user).into(schema.user).execute();
//       return user;
//     },

//     async getUserByEmail(email) {
//       const result = await db.query.selectFrom(schema.user).where({ email }).single();
//       return result ? result : null;
//     },
//     // ... (Implement other adapter methods as needed)
//   };
// };











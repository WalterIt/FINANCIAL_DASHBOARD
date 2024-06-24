import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";


// const schema = {schema: "./db/schema.ts",}

config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool)

export default db;


  
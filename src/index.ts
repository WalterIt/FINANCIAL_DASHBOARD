import { is } from "drizzle-orm"
import { PgDatabase } from "drizzle-orm/pg-core"
import { DefaultPostgresSchema } from "./lib/user-auth"
import { PostgresDrizzleAdapter } from "./lib/user-auth"
import { DefaultSchema, SqlFlavorOptions } from "./lib/drizzle-utils"

import type { Adapter } from "@auth/core/adapters"

// ... other imports and code

export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor,
  schema?: DefaultSchema<SqlFlavor>
): Adapter {

  if (is(db, PgDatabase)) {
    return PostgresDrizzleAdapter(db, schema as DefaultPostgresSchema)
  }

  throw new Error(
    `Unsupported database type (${typeof db}) in Auth.js Drizzle adapter.`
  )
}

import type { QueryResultHKT as PostgresQueryResultHKT } from "drizzle-orm/pg-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { DefaultPostgresSchema } from "./user-auth" // This line imports DefaultPostgresSchema from user-auth

type AnyPostgresDatabase = PgDatabase<PostgresQueryResultHKT, any>

export type SqlFlavorOptions = AnyPostgresDatabase

export type DefaultSchema<Flavor extends SqlFlavorOptions> = DefaultPostgresSchema | never

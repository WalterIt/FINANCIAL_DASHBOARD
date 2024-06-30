/***
 * Whether to use the custom adapter code or the suggestions above depends on your specific project needs. Here's a breakdown to help you decide:

**Use the custom adapter (with caution) if:**

- You **absolutely need** fine-grained control over user management logic that isn't provided by existing adapters.
- You're already using Drizzle ORM in your project and want a tightly integrated solution.

**Use the suggestions above (recommended) if:**

- You prioritize **simplicity and ease of use**.
- Your project uses a **supported database** with an existing adapter for Auth.js (check the documentation).
- You're **unsure about the complexity** of managing a custom adapter.

**Consider these additional factors:**

- **Development and maintenance effort:** Creating and maintaining a custom adapter requires more work compared to using an existing one.
- **Potential bugs and edge cases:** Custom code might introduce bugs you'll need to troubleshoot.
- **Community support:** Existing adapters might have better community support for troubleshooting.

**Here's a revised recommendation:**

1. **Prioritize existing adapters:** If a supported adapter exists for your database in Auth.js, use that first. It will likely be easier to set up and maintain.
2. **Consider the `@auth/drizzle-adapter` (if available, use with caution):** Explore the possibility of a third-party `@auth/drizzle-adapter` if you're set on Drizzle ORM integration. However, research its compatibility, support level, and potential dependency conflicts before using it in production.
3. **Custom adapter as last resort:** If the above options don't work and you have a strong need for customization, then the provided custom adapter code can be a solution. But be prepared to invest time and effort in understanding, implementing, and maintaining it.

By carefully evaluating your project's requirements and the available options, you can make an informed decision about the best approach for user authentication and data management.
 */



import { InferInsertModel, and, eq, getTableColumns } from "drizzle-orm"
import {
  PgColumn,
  PgDatabase,
  PgTableWithColumns,
  QueryResultHKT,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  varchar,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterAccountType,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);

export function defineTables(
  schema: Partial<DefaultPostgresSchema> = {}
): Required<DefaultPostgresSchema> {
  const usersTable =
    schema.usersTable ??
    (pgTable("user", {
      id: varchar('id', { length: 255 }).primaryKey(),
      name: text("name"),
      email: text("email").notNull(),
      role: roleEnum('role').default('USER'), 
      emailVerified: timestamp("emailVerified", { mode: "date" }),
      image: text("image"),
    }) satisfies DefaultPostgresUsersTable)

  const accountsTable =
    schema.accountsTable ??
    (pgTable(
      "account",
      {
        userId: text("userId")
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
      },
      (account) => ({
        compositePk: primaryKey({
          columns: [account.provider, account.providerAccountId],
        }),
      })
    ) satisfies DefaultPostgresAccountsTable)

  const sessionsTable =
    schema.sessionsTable ??
    (pgTable("session", {
      sessionToken: text("sessionToken").primaryKey(),
      userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    }) satisfies DefaultPostgresSessionsTable)

  const verificationTokensTable =
    schema.verificationTokensTable ??
    (pgTable(
      "verificationToken",
      {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
      },
      (verficationToken) => ({
        compositePk: primaryKey({
          columns: [verficationToken.identifier, verficationToken.token],
        }),
      })
    ) satisfies DefaultPostgresVerificationTokenTable)

  const authenticatorsTable =
    schema.authenticatorsTable ??
    (pgTable(
      "authenticator",
      {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
      },
      (authenticator) => ({
        compositePK: primaryKey({
          columns: [authenticator.userId, authenticator.credentialID],
        }),
      })
    ) satisfies DefaultPostgresAuthenticatorTable)

  return {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  }
}

export function PostgresDrizzleAdapter(
  client: PgDatabase<QueryResultHKT, any>,
  schema?: DefaultPostgresSchema
): Adapter {
  const {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  } = defineTables(schema)

  return {
    async createUser(data: AdapterUser) {
      const { id, ...insertData } = data
      const hasDefaultId = getTableColumns(usersTable)["id"]["hasDefault"]

      return client
        .insert(usersTable)
        .values(hasDefaultId ? insertData : { ...insertData, id })
        .returning()
        .then((res) => res[0])
    },
    async getUser(userId: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async getUserByEmail(email: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async createSession(data: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      return client
        .insert(sessionsTable)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async getSessionAndUser(sessionToken: string) {
      return client
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      const [result] = await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))
        .returning()

      if (!result) {
        throw new Error("No user found.")
      }

      return result
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      return client
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0])
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(accountsTable).values(data)
    },
    async getUserByAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      const result = await client
        .select({
          account: accountsTable,
          user: usersTable,
        })
        .from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .where(
          and(
            eq(accountsTable.provider, account.provider),
            eq(accountsTable.providerAccountId, account.providerAccountId)
          )
        )
        .then((res) => res[0])

      return result?.user ?? null
    },
    async deleteSession(sessionToken: string) {
      await client
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
    },
    async createVerificationToken(data: VerificationToken) {
      return client
        .insert(verificationTokensTable)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return client
        .delete(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, params.identifier),
            eq(verificationTokensTable.token, params.token)
          )
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async deleteUser(id: string) {
      await client.delete(usersTable).where(eq(usersTable.id, id))
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      await client
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, params.provider),
            eq(accountsTable.providerAccountId, params.providerAccountId)
          )
        )
    },
    async getAccount(providerAccountId: string, provider: string) {
      return client
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId)
          )
        )
        .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>
    },
    async createAuthenticator(data: AdapterAuthenticator) {
      return client
        .insert(authenticatorsTable)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null)
    },
    async getAuthenticator(credentialID: string) {
      return client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .then((res) => res[0] ?? null)
    },
    async listAuthenticatorsByUserId(userId: string) {
      return client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.userId, userId))
        .then((res) => res)
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await client
        .update(authenticatorsTable)
        .set({ counter: newCounter })
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .returning()
        .then((res) => res[0])

      if (!authenticator) throw new Error("Authenticator not found.")

      return authenticator
    },
  }
}

type DefaultPostgresColumn<
  T extends {
    data: string | number | boolean | Date
    dataType: "string" | "number" | "boolean" | "date"
    notNull: boolean
    columnType:
      | "PgVarchar"
      | "PgText"
      | "PgBoolean"
      | "PgTimestamp"
      | "PgInteger"
      | "PgUUID"
  },
> = PgColumn<{
  name: string
  columnType: T["columnType"]
  data: T["data"]
  driverParam: string | number | boolean
  notNull: T["notNull"]
  hasDefault: boolean
  enumValues: any
  dataType: T["dataType"]
  tableName: string
}>

export type DefaultPostgresUsersTable = PgTableWithColumns<{
  name: string
  columns: {
    id: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      data: string
      notNull: true
      dataType: "string"
    }>
    name: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
      dataType: "string"
    }>
    email: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    emailVerified: DefaultPostgresColumn<{
      dataType: "date"
      columnType: "PgTimestamp"
      data: Date
      notNull: boolean
    }>
    image: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresAccountsTable = PgTableWithColumns<{
  name: string
  columns: {
    userId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      data: string
      notNull: true
      dataType: "string"
    }>
    type: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    provider: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
    }>
    refresh_token: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    access_token: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    expires_at: DefaultPostgresColumn<{
      dataType: "number"
      columnType: "PgInteger"
      data: number
      notNull: boolean
    }>
    token_type: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    scope: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    id_token: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    session_state: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresSessionsTable = PgTableWithColumns<{
  name: string
  columns: {
    sessionToken: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    userId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultPostgresColumn<{
      dataType: "date"
      columnType: "PgTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresVerificationTokenTable = PgTableWithColumns<{
  name: string
  columns: {
    identifier: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    token: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultPostgresColumn<{
      dataType: "date"
      columnType: "PgTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresAuthenticatorTable = PgTableWithColumns<{
  name: string
  columns: {
    credentialID: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    userId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialPublicKey: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    counter: DefaultPostgresColumn<{
      columnType: "PgInteger"
      data: number
      notNull: true
      dataType: "number"
    }>
    credentialDeviceType: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialBackedUp: DefaultPostgresColumn<{
      columnType: "PgBoolean"
      data: boolean
      notNull: true
      dataType: "boolean"
    }>
    transports: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: false
      dataType: "string"
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresSchema = {
  usersTable: DefaultPostgresUsersTable
  accountsTable: DefaultPostgresAccountsTable
  sessionsTable?: DefaultPostgresSessionsTable
  verificationTokensTable?: DefaultPostgresVerificationTokenTable
  authenticatorsTable?: DefaultPostgresAuthenticatorTable
}







export const financialAccounts = pgTable("financial_accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  plaidId: text("plaid_id"),
});

export const financialAccountsRelations = relations(financialAccounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertFinancialAccountSchema = createInsertSchema(financialAccounts);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  plaidId: text("plaid_id"),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

export const transactions = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  financialAccountId: text("financial_account_id")
    .references(() => financialAccounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  financialAccount: one(financialAccounts, {
    fields: [transactions.financialAccountId],
    references: [financialAccounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});








// export type User = typeof user.$inferSelect; // return type when queried
// export type NewUser = typeof user.$inferInsert; // insert type

// export async function insertUser(user: NewUser): Promise<User[]> {
//   return db.insert(user).values(user).returning();
// }

// const db = drizzle(...);

// const result: User[] = await db.select().from(user);

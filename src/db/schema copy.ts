// import { pgTable, primaryKey, integer, timestamp, pgEnum, serial, text, varchar } from 'drizzle-orm/pg-core';
// import { boolean, uniqueIndex } from 'drizzle-orm/pg-core';
// import { createInsertSchema } from "drizzle-zod";
// import { relations } from "drizzle-orm";
// import { z } from "zod";
// import postgres from "postgres"
// import { drizzle } from "drizzle-orm/postgres-js"
// import type { AdapterAccountType } from "next-auth/adapters"
// import { config } from "dotenv";

// config({ path: ".env" });
 
// const connectionString = process.env.AUTH_DRIZZLE_URL!;
// const pool = postgres(connectionString, { max: 1 })
 
// export const db = drizzle(pool)



// export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);

// export const users = pgTable("users", {
//   id: varchar('id', { length: 455 }).primaryKey(),
//   name: text("name"),
//   email: text("email").notNull(),
//   password: text('password'),
//   role: roleEnum('role').default('USER'), 
//   emailVerified: timestamp("emailVerified", { withTimezone: true}),
//   image: text("image"),
// })


// // export const users = pgTable('user', {
// //   id: text("id")
// //     .primaryKey()
// //     .$defaultFn(() => crypto.randomUUID()),
// //   name: text('name'),
// //   email: text('email').unique(),
// //   password: text('password'),
// //   role: roleEnum('role').default('USER'), 
// //   emailVerified: timestamp('emailVerified', {  withTimezone: true }),
// //   image: text('image'),
// //   // isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
// //   // twoFactorConfirmation: text('twoFactorConfirmation'),

// // });

// export const insertUserSchema = createInsertSchema(users);


// export const accounts = pgTable(
//   "accounts",
//   {
//     userId: text("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     type: text("type").$type<AdapterAccountType>().notNull(),
//     provider: text("provider").notNull(),
//     providerAccountId: text("providerAccountId").notNull(),
//     refresh_token: text("refresh_token"),
//     access_token: text("access_token"),
//     expires_at: integer("expires_at"),
//     token_type: text("token_type"),
//     scope: text("scope"),
//     id_token: text("id_token"),
//     session_state: text("session_state"),
//   },
//   (accounts) => ({
//     compoundKey: primaryKey({
//       columns: [accounts.provider, accounts.providerAccountId],
//     }),
//   })
// )

// export const insertAccountSchema = createInsertSchema(accounts);

// // Create the realionship between accounts and users
// export const accountRelations = relations(accounts, ({ one }) => ({
//   user: one(users, {
//     fields: [accounts.userId],
//     references: [users.id],
//   }),
// }));

// export const sessions = pgTable("sessions", {
//   sessionToken: text("sessionToken").primaryKey(),
//   userId: text("userId")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
//   expires: timestamp("expires", { mode: "date" }).notNull(),
// })


// export const verificationTokens = pgTable('verification_tokens', {
//     id: text("id").primaryKey(),
//     email: text('email').notNull(),
//     token: text('token').notNull().unique(), // Unique constraint on token
//     expiresAt: timestamp('expiresAt'), // Use expiresAt instead of DateTime
//   }, (table) => ({
//     uniqueEmailToken: uniqueIndex('email_and_token_uniqueIndex').on(table.email, table.token),
//   }));

// export const insertVerificationTokensSchema = createInsertSchema(verificationTokens);



// export const authenticators = pgTable(
//   "authenticators",
//   {
//     credentialID: text("credentialID").notNull().unique(),
//     userId: text("userId")
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     providerAccountId: text("providerAccountId").notNull(),
//     credentialPublicKey: text("credentialPublicKey").notNull(),
//     counter: integer("counter").notNull(),
//     credentialDeviceType: text("credentialDeviceType").notNull(),
//     credentialBackedUp: boolean("credentialBackedUp").notNull(),
//     transports: text("transports"),
//   },
//   (authenticators) => ({
//     compositePK: primaryKey({
//       columns: [authenticators.userId, authenticators.credentialID],
//     }),
//   })
// )



// // export const twoFactorToken  = pgTable('two_factor_token', {
// //     id: text("id").primaryKey(),
// //     email: text('email').notNull(),
// //     token: text('token').notNull().unique(), // Unique constraint on token
// //     expiresAt: timestamp('expiresAt'), // Use expiresAt instead of DateTime
// //   }, (table) => ({
// //     uniqueIndex: uniqueIndex('unique_email_token').on(table.email, table.token),
// //   }));

// //   export const insertTwoFactorTokenSchema = createInsertSchema(twoFactorToken);


// //   export const twoFactorConfirmations = pgTable('two_factor_confirmations', {
// //     id: text("id").primaryKey(),  
// //     userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),// Foreign key with cascade delete
// //   });

// //   export const inserttwoFactorConfirmationsSchema = createInsertSchema(twoFactorConfirmations);
  



//   export const financialAccounts = pgTable("financial_accounts", {
//     id: text("id").primaryKey(),
//     name: text("name").notNull(),
//     userId: text("user_id").notNull(),
//     plaidId: text("plaid_id"),
//   });
  
//   export const financialAccountsRelations = relations(financialAccounts, ({ many }) => ({
//     transactions: many(transactions),
//   }));
  
//   export const insertFinancialAccountSchema = createInsertSchema(financialAccounts);
  
//   export const categories = pgTable("categories", {
//     id: text("id").primaryKey(),
//     name: text("name").notNull(),
//     userId: text("user_id").notNull(),
//     plaidId: text("plaid_id"),
//   });
  
//   export const categoriesRelations = relations(categories, ({ many }) => ({
//     transactions: many(transactions),
//   }));
  
//   export const insertCategorySchema = createInsertSchema(categories);
  
//   export const transactions = pgTable("transactions", {
//     id: text("id").primaryKey(),
//     amount: integer("amount").notNull(),
//     payee: text("payee").notNull(),
//     notes: text("notes"),
//     date: timestamp("date", { mode: "date" }).notNull(),
//     financialAccountId: text("financial_account_id")
//       .references(() => financialAccounts.id, {
//         onDelete: "cascade",
//       })
//       .notNull(),
//     categoryId: text("category_id").references(() => categories.id, {
//       onDelete: "set null",
//     }),
//   });
  
//   export const transactionsRelations = relations(transactions, ({ one }) => ({
//     financialAccount: one(financialAccounts, {
//       fields: [transactions.financialAccountId],
//       references: [financialAccounts.id],
//     }),
//     category: one(categories, {
//       fields: [transactions.categoryId],
//       references: [categories.id],
//     }),
//   }));
  
//   export const insertTransactionSchema = createInsertSchema(transactions, {
//     date: z.coerce.date(),
//   });








// export type User = typeof users.$inferSelect; // return type when queried
// export type NewUser = typeof users.$inferInsert; // insert type

// // export async function insertUser(user: NewUser): Promise<User[]> {
// //   return db.insert(users).values(user).returning();
// // }

// // const db = drizzle(...);

// // const result: User[] = await db.select().from(users);


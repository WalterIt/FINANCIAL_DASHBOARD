import { pgTable, integer, timestamp, pgEnum, serial, text, varchar } from 'drizzle-orm/pg-core';
import { boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";



export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);

export const users = pgTable('users', {
  id: varchar('id', { length: 955 }).primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  password: text('password'),
  role: roleEnum('role').default('USER'), 
  emailVerified: timestamp('emailVerified', {  withTimezone: true }),
  image: text('image'),
  isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
  twoFactorConfirmation: text('twoFactorConfirmation'),

});

export const insertUserSchema = createInsertSchema(users);


export const accounts = pgTable('accounts', {
  id: text("id").primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull().unique(),  //  emailUniqueIndex: uniqueIndex('emailUniqueIndex')
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: serial('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (table) => ({
  uniqueIndex: uniqueIndex('provider_providerAccountId_uniqueIndex').on(table.provider, table.providerAccountId),
}));

export const insertAccountSchema = createInsertSchema(accounts);


export const verificationTokens = pgTable('verification_tokens', {
    id: text("id").primaryKey(),
    email: text('email').notNull(),
    token: text('token').notNull().unique(), // Unique constraint on token
    expiresAt: timestamp('expiresAt'), // Use expiresAt instead of DateTime
  }, (table) => ({
    uniqueEmailToken: uniqueIndex('email_and_token_uniqueIndex').on(table.email, table.token),
  }));

export const insertVerificationTokensSchema = createInsertSchema(verificationTokens);

export const twoFactorToken  = pgTable('two_factor_token', {
    id: text("id").primaryKey(),
    email: text('email').notNull(),
    token: text('token').notNull().unique(), // Unique constraint on token
    expiresAt: timestamp('expiresAt'), // Use expiresAt instead of DateTime
  }, (table) => ({
    uniqueIndex: uniqueIndex('unique_email_token').on(table.email, table.token),
  }));

  export const insertTwoFactorTokenSchema = createInsertSchema(twoFactorToken);


  export const twoFactorConfirmations = pgTable('two_factor_confirmations', {
    id: text("id").primaryKey(),  
    userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),// Foreign key with cascade delete
  });

  export const inserttwoFactorConfirmationsSchema = createInsertSchema(twoFactorConfirmations);
  



  export const financialAccounts = pgTable("financial_accounts", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
    plaidId: text("plaid_id"),
  });
  
  export const accountsRelations = relations(financialAccounts, ({ many }) => ({
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








// export type User = typeof users.$inferSelect; // return type when queried
// export type NewUser = typeof users.$inferInsert; // insert type


// const db = drizzle(...);

// const result: User[] = await db.select().from(users);

// export async function insertUser(user: NewUser): Promise<User[]> {
//   return db.insert(users).values(user).returning();
// }

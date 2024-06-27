'use server';

// src/lib/insertUser.ts
import db from "@/db/drizzle";
import { NewUser, User, users } from "@/db/schema";

export async function insertUser(user: NewUser): Promise<User[]> {
  console.log(`Inserting user: ${JSON.stringify(user)}`);
  try {
    return await db.insert(users).values(user).returning();
  } catch (error) {
    if ((error as { message: string }).message.includes("users_email_unique")) {
      throw new Error("Email is already used");
    }
    throw error;
  }
}

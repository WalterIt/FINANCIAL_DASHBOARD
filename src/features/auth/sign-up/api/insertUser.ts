'use server';

// src/lib/insertUser.ts
import db from "@/db/drizzle";
import { NewUser, User, users } from "@/db/schema";
import bcrypt from "bcryptjs"

export async function insertUser(user: NewUser): Promise<User[]> {
  const { name, email, password } = user;
  let hashedPassword: string | null = null;
  
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  
  try {    
    return await db.insert(users).values({...user, password: hashedPassword}).returning();
  } catch (error) {
    if ((error as { message: string }).message.includes("users_email_unique")) {
      throw new Error("Email is already used");
    }
    throw error;
  }
}

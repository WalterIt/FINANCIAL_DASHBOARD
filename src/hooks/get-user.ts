import { db } from "@/db/drizzle";
import { User, users } from "@/db/schema";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await (db.select() as any).from(users).where({ email }).first();
    return user || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

export const getUserById = async (id: string | undefined): Promise<User | null> => {
  if (!id) return null;

  try {
    const userId = (await db.select() as any).from(users).where({ id });
    return userId[0] || null;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }
};

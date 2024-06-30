// import bcrypt from 'bcryptjs';
// import { db } from '@/db/drizzle'; // Adjust the import based on your setup
// import { eq } from 'drizzle-orm';
// import { z } from 'zod';
// import { LoginSchema } from "@/schemas";
// import { User, users } from '@/db/schema';

// // Function to compare the plain password with the hashed password from the database
// // export async function comparePassword(credentialPasword: string): Promise<typeof LoginSchema | null> {
// //   const user = await getUserByEmail(credentialPasword);

// //   // Compare the plain password with the hashed password using bcrypt
// //   const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
// //   return isMatch;
// // }

// // Get user by email using Drizzle ORM
// export async function getUserByEmail(email: string): Promise<User | null> {
//   // Validate the email input using zod
//   const emailSchema = z.string().email();
//   const validatedEmail = emailSchema.parse(email);

//   // Validate the email input using zod
//   if (!emailSchema.safeParse(email).success) {
//     throw new Error('Invalid Email!');
//   }


//   // Define the user model (Adjust based on your database schema)
//   const user = await db
//     .select()
//     .from(users) // Adjust the table name based on your setup
//     .where(eq(users.email, validatedEmail))
//     .execute();

//   // Check if the user exists
//   if (!user.length) {
//     throw new Error('User not found!');
//   }

//   // Return the user object or null if not found
//   return user[0] || null;
// }

// // Get user by ID using Drizzle ORM
// export async function getUserById(userId: string): Promise<User | null> {
//   // Validate the user ID input using zod
//   const userIdSchema = z.string().uuid(); // Assuming the user ID is a UUID
//   const validatedUserId = userIdSchema.parse(userId);

//   // Define the user model (Adjust based on your database schema)
//   const user = await db
//     .select()
//     .from(users) // Adjust the table name based on your setup
//     .where(eq(users.id, validatedUserId))
//     .execute();

//   // Check if the user exists
//   if (!user.length) {
//     throw new Error('User not found!');
//   }

//   // Return the user object or null if not found
//   return user[0] || null;
// }

// // Define the User type based on your database schema (Adjust as necessary)
// export interface UserLogin {
//   email?: string;
//   password?: string;
// }

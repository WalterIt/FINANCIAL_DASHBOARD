
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"

import { LoginSchema } from "./schemas";
import { getUserByEmail } from "@/hooks/get-user";

export default {
  providers: [
    Google({
      clientId : process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials)

        if (!validateFields.success) {
          // Check for existence of details property (Zod v3+)
          if (validateFields.error.message) {
            const errors = validateFields.error.message;
            console.log(errors)
            // ... rest of your code using errors
          } else {
            // Fallback for older Zod versions (use issues)
            const errors = validateFields.error.issues;
            console.log(errors)
            // ... rest of your code using errors
          }
        }
        

        if(validateFields.success) {
          const { email, password } = validateFields.data
          const user : any = await getUserByEmail(email)

          if(!user || !user.password) return null;
          
          const passwordMatch = await bcrypt.compare(password, user.password)

          if(passwordMatch) return user; 
        }
        return null
      }
    }),

  ],
} satisfies NextAuthConfig
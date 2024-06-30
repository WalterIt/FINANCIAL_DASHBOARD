import { Hono } from "hono";
import {db}  from "@/db/drizzle";
import { eq, inArray, and } from "drizzle-orm";
import { users, insertUserSchema } from "@/db/schema";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "../../../lib/user-auth";
import { DEFAULT_REDIRECT_ROUTES } from "../../../../routes";
import { AuthError } from "next-auth";

const app = new Hono()
  .post(
    "/",
    zValidator("json", z.object({
      email: z.string().email(),
      password: z.string(),
    })),
    async (c) => {
      const { email, password } = c.req.valid("json");

      // Check if the email exists in the database 
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user.length) {
        throw new HTTPException(401, {
          res: c.json({ message: "Invalid Email or Password!" }, 401),
        });
      }

      // Check if the password is correct
      const hashedPassword = user[0].password;

      if (hashedPassword === null) {
        throw new HTTPException(401, {
          res: c.json({ message: "Invalid Email or Password!" }, 401),
        });
      }

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (!passwordMatch) {
        throw new HTTPException(401, {
          res: c.json({ message: "Invalid Email or Password!" }, 401),
        });
      }

      console.log(email, password);

      try {
        await  signIn("credentials", {
          email,
          password,
          redirectTo: DEFAULT_REDIRECT_ROUTES,
        });
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              throw new HTTPException(401, {
                res: c.json({ error: "Invalid Email or Password!" }, 401),
              });
            default:
              return c.json({ error: "Something Went Wrong!" }, 401);
          }
        }
        
      }

      // throw Error;

      // Return a success response
      // return c.json({ message: "Login successful!" });  
    }
  );

export default app;
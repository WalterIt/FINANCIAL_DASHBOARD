import { Hono } from "hono"
import { users } from "@/db/schema"
import db from "@/db/drizzle"


const app = new Hono()
    .get('/',  async (c) => {        // Get All Users
       const allUsers = await db.select().from(users)
       console.log(allUsers.map(user => user.name));
       if (allUsers.length === 0) return c.json({message: 'No users found'})
       return c.json(allUsers);
    })

export default app;

import { Hono } from "hono"
import { users } from "@/db/schema"
import db from "@/db/drizzle"

const app = new Hono()
    .get('/',  async (c) => {        // Get All Users
        // const data = db.select.from("users");

        // return c.json({data})
    })

export default app;

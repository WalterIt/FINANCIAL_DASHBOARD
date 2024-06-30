import { Hono, Context } from "hono";
import { cors } from 'hono/cors'
import { handle } from 'hono/vercel'
import { authHandler,initAuthConfig,verifyAuth} from "@hono/auth-js"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
// import type { PageConfig } from 'next'

import login from './login';
import users from './users';
import authors from './authors'
import books from './books'

export const runtime = 'nodejs'

// export const config: PageConfig = {
//   api: {
//     bodyParser: false,
//   },
// }

const app = new Hono().basePath('/api')

app.use('/*', cors())

// app.use(
//   '/api2/*',
//   cors({
//     origin: 'http://example.com',
//     allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
//     allowMethods: ['POST', 'GET', 'OPTIONS'],
//     exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//     maxAge: 600,
//     credentials: true,
//   })
// )

// app.use("*", initAuthConfig(c=>({
//   secret: c.env.AUTH_SECRET,
//   providers: [
//     GitHub({
//       clientId: c.env.GITHUB_ID,
//       clientSecret: c.env.GITHUB_SECRET
//     }),
//     Google({
//       clientId: c.env.GOOGLE_CLIENT_ID,
//       clientSecret: c.env.GOOGLE_CLIENT_SECRET
//     }),
//   ],
// })))

// app.use("/auth/*", authHandler())

// app.use("/*", verifyAuth())

// app.get("/protected", async (c)=> {
//   const auth = c.get("authUser")
//   return c.json(auth)
// })

const routes = app
  .route('/login', login)
  .route('/users', users)
  .route('/authors', authors)
  .route('/books', books)

app.get('/hello', async (c) => {
  const auth = c.get("authUser")
  return c.json({
    message: 'Hello Next.js & HONO!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;
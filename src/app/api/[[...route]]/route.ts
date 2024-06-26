import { Hono, Context } from "hono";
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
// import type { PageConfig } from 'next'

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

const routes = app
  .route('/users', users)
  // .route('/authors', authors)
  // .route('/books', books)

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js & HONO!',
  })
})

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes;
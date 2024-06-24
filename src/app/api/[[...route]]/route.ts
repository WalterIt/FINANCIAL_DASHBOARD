import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import login from './login';
import authors from './authors'
import books from './books'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .route('/sign-in', login)
  .route('/authors', authors)
  .route('/books', books)

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js & HONO!',
  })
})

export const GET = handle(app)
export const POST = handle(app)

export type AppType = typeof routes;
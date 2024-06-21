import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import authors from './authors'
import books from './books'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.route('/authors', authors)
app.route('/books', books)

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js & HONO!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
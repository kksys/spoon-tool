import { Context, Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono()

app.use(cors({
  origin: ['https://spoon-tool.kk-systems.net/'],
  allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
  allowMethods: ['GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}))

const isRequestFromFrontend = (c: Context) =>
  (
    !!c.req.header('host')?.match(/api\.spoon-tool\.kk-systems\.net/) &&
    !!c.req.header('origin')?.match(/spoon-tool\.kk-systems\.net/)
  )

app.use(async (c, next) => {
  if (!isRequestFromFrontend(c)) {
    return c.json({
      error: 'Forbidden'
    }, 403)
  }

  await next()
})

app.get('/search/user/', async (c) => {
  const query = new URLSearchParams(c.req.query())
  const searchUserUrl = `https://jp-api.spooncast.net/search/user/?${query}`

  const response = await fetch(searchUserUrl, {
    method: 'GET'
  })

  return new Response(await response.arrayBuffer(), response)
})

app.get('/users/:userId', async (c) => {
  const { userId } = c.req.param()
  const getProfileUrl = `https://jp-api.spooncast.net/users/${userId}/`

  const response = await fetch(getProfileUrl, {
    method: 'GET'
  })

  return new Response(await response.arrayBuffer(), response)
})

app.all('*', (c) => {
  return c.json({
    error: 'Not Found'
  }, 404)
})

export default app

import { Context, Hono } from 'hono'
import { env } from 'hono/adapter'
import { cors } from 'hono/cors'

interface Env extends Record<string, string> {
  BACKEND_HOST: string
  FRONTEND_HOST: string
}

const app = new Hono()

app.use(
  '*',
  async (c, next) => {
    const { FRONTEND_HOST } = env<Env>(c)

    const middleware = cors({
      origin: `https://${FRONTEND_HOST}`,
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
      allowMethods: ['GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    })

    return middleware(c, next)
  }
)

const isRequestFromFrontend = (c: Context) => {
  const { BACKEND_HOST, FRONTEND_HOST } = env<Env>(c)
  return (
    !!c.req.header('host')
      ?.match(new RegExp(`^${BACKEND_HOST}$`)) &&
    !!c.req.header('origin')
      ?.match(new RegExp(`^https://${FRONTEND_HOST}`))
  )
}

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

import { Context, Hono } from 'hono'
import { env } from 'hono/adapter'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>()

app.use(
  '*',
  async (c, next) => {
    const { FRONTEND_HOST } = env(c)

    const middleware = cors({
      origin: `${FRONTEND_HOST}`,
      allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
      allowMethods: ['GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    })

    return middleware(c, next)
  }
)

const isRequestFromFrontend = (c: Context<{ Bindings: Env }, never>) => {
  const { BACKEND_HOST, FRONTEND_HOST } = env(c)
  return (
    !!c.req.header('host')
      ?.match(new RegExp(`^${BACKEND_HOST}$`)) &&
    !!c.req.header('origin')
      ?.match(new RegExp(`^${FRONTEND_HOST}`))
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
  const searchUserUrl = new URL('https://jp-api.spooncast.net/search/user/')

  query.forEach((value, key) => {
    searchUserUrl.searchParams.append(key, value)
  })

  const response = await fetch(searchUserUrl, {
    method: 'GET'
  })

  return new Response(await response.arrayBuffer(), response)
})

app.get('/users/:userId', async (c) => {
  const { userId } = c.req.param()
  const getProfileUrl = new URL(`https://jp-api.spooncast.net/users/${userId}/`)

  const response = await fetch(getProfileUrl, {
    method: 'GET'
  })

  return new Response(await response.arrayBuffer(), response)
})

app.get('/users/:userId/followers', async (c) => {
  const { userId } = c.req.param()
  const queryParams = c.req.query()
  const query = new URLSearchParams(queryParams)
  const getFollowersUrl = new URL(`https://jp-api.spooncast.net/users/${userId}/followers/`)

  query.forEach((value, key) => {
    getFollowersUrl.searchParams.append(key, value)
  })

  const response = await fetch(getFollowersUrl, {
    method: 'GET'
  })

  return new Response(await response.arrayBuffer(), response)
})

app.get('/users/:userId/followings', async (c) => {
  const { userId } = c.req.param()
  const queryParams = c.req.query()
  const query = new URLSearchParams(queryParams)
  const getFollowingsUrl = new URL(`https://jp-api.spooncast.net/users/${userId}/followings/`)

  query.forEach((value, key) => {
    getFollowingsUrl.searchParams.append(key, value)
  })

  const response = await fetch(getFollowingsUrl, {
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

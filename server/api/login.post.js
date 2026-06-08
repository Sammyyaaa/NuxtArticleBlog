import { SignJWT } from 'jose'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  const body = await readBody(event)

  if (!(body.account === config.adminAccount && body.password === config.adminPassword)) {
    throw createError({
      statusCode: 400,
      statusMessage: '登入失敗'
    })
  }

  const jwtTokenPayload = {
    id: 1,
    nickname: 'accountUser',
    email: 'accountUser13579@gmail.com',
    avatar: '/COCO.jpg'
  }

  const maxAge = 60 * 60 * 24 * 7
  const expires = Math.floor(Date.now() / 1000) + maxAge

  const jwtToken = await new SignJWT({ data: jwtTokenPayload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expires)
    .sign(secret)

  setCookie(event, 'access_token', jwtToken, {
    maxAge,
    expires: new Date(expires * 1000),
    secure: true,
    httpOnly: true,
    path: '/'
  })

  return '登入成功'
})

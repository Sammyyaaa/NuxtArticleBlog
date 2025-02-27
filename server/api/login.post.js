import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!(body.account === 'accountUser' && body.password === '1234567')) {
    throw createError({
      statusCode: 400,
      statusMessage: '登入失敗'
    })
  }

  const jwtTokenPayload = {
    id: 1,
    nickname: 'accountUser',
    email: 'accountUser13579@gmail.com',
    avatar: 'https://a.520gexing.com/uploads/allimg/2019012013/fq35kq1oppt.jpg'
  }

  const maxAge = 60 * 60 * 24 * 7
  const expires = Math.floor(Date.now() / 1000) + maxAge

  const jwtToken = jwt.sign(
    {
      exp: expires,
      data: jwtTokenPayload
    },
    'JWT_SIGN_SECRET_PLEASE_REPLACE_WITH_YOUR_KEY'
  )

  setCookie(event, 'access_token', jwtToken, {
    maxAge,
    expires: new Date(expires * 1000),
    secure: true,
    httpOnly: true,
    path: '/'
  })

  return '登入成功'
})

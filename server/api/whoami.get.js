import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = new TextEncoder().encode(config.jwtSecret)
  // 接收 login.post.js API 登入設定 cookie 的 jwtToken
  const jwtToken = getCookie(event, 'access_token')

  try {
    // 解析 jwtToken 並取出 data 資料
    const {
      payload: { data: userInfo }
    } = await jwtVerify(jwtToken, secret)

    return {
      id: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      avatar: userInfo.avatar
    }
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
})

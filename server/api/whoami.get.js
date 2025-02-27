import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  // 接收 login.post.js API 登入設定 cookie 的 jwtToken
  const jwtToken = getCookie(event, 'access_token')

  try {
    // 解析 jwtToken 並取出 data 資料
    const { data: userInfo } = jwt.verify(jwtToken, 'JWT_SIGN_SECRET_PLEASE_REPLACE_WITH_YOUR_KEY')

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

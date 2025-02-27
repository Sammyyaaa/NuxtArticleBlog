import jwt from 'jsonwebtoken'

// 只要在新增、刪除文章中執行中間件權限驗證
const urls = [
  {
    path: '/api/articles',
    method: 'POST'
  },
  {
    path: /^\/api\/articles\/(.*)($|\?.*|#.*)/,
    method: 'DELETE'
  },
  {
    path: /^\/api\/articles\/(.*)($|\?.*|#.*)/,
    method: 'PATCH'
  }
]

// 所有 API 執行之前，都會處理這個檔案中間件的 tooken 驗證
export default defineEventHandler((event) => {
  const requireVerify = urls.some((apiUrl) => {
    // 請求的 API 路由 和 urls 設置的 path 是否為匹配
    if (event.method === apiUrl.method) {
      // 如果為正則表達式
      if (apiUrl.path instanceof RegExp) {
        // 進行正則表達的測試函式
        return apiUrl.path.test(event.path)
      }
      // 一般的字串路徑比對
      return event.path === apiUrl.path
    }

    return false
  })

  if (!requireVerify) {
    return
  }

  const jwtToken = getCookie(event, 'access_token') // 獲取請求中的 token

  if (jwtToken) {
    try {
      const { data: user } = jwt.verify(jwtToken, 'JWT_SIGN_SECRET_PLEASE_REPLACE_WITH_YOUR_KEY')
      // token 有資料時，添加在 event.context 中添加 auth 物件，其中包含 user 資料
      event.context.auth = {
        user
      }
    } catch (error) {
      console.log(error)
    }
  }
})

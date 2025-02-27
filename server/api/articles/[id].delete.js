import { pool } from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  // 判斷在 API 中間件 auth.js 加入的 auth 資料物件
  if (event.context?.auth?.user?.id !== 1) {
    throw createError({
      statusCode: 401,
      message: '沒有權限'
    })
  }
  const articleId = getRouterParam(event, 'id') // 從檔名的 [id] 獲取 id 參數

  const result = await pool
    .query('DELETE FROM "article" WHERE "id" = $1;', [articleId]) // 刪除指定 id 文章
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw createError({
        statusCode: 500,
        message: '無法刪除文章，請稍候再試'
      })
    })

  // result.rowCount = 1 表示刪除成功
  if (result.rowCount !== 1) {
    throw createError({
      statusCode: 400,
      message: '刪除文章失敗，請稍候再試'
    })
  }

  return {
    message: '文章刪除成功'
  }
})

import { pool } from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, 'id') // 從檔名的 [id] 獲取 id 參數

  const articleRecord = await pool
    .query('SELECT * FROM "article" WHERE "id" = $1;', [articleId])
    .then((result) => result.rows?.[0]) // 查詢第一筆資料
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw createError({
        statusCode: 500,
        message: '無法取得文章，請稍候再試'
      })
    })

  if (!articleRecord) {
    throw createError({
      statusCode: 400,
      message: '取得文章失敗，請稍候再試'
    })
  }

  return articleRecord
})

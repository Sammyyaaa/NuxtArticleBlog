import { pool } from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event) // 獲取網址結尾查詢參數

  const page = Math.max(parseInt(query.page) || 1, 1) // 獲取網址結尾查詢參數 api/articles?page=1，表示第幾頁
  const pageSize = Math.min(Math.max(parseInt(query.pageSize) || 10, 1), 100) // 獲取網址結尾查詢參數 api/articles?page=1&pageSize=2，控制文章數量

  const articleRecords = await pool
    .query('SELECT * FROM "article" ORDER BY "updated_at" DESC OFFSET $1 LIMIT $2;', [
      (page - 1) * pageSize, // 計算 OFFSET（跳過的記錄數）
      pageSize // 設定 LIMIT（每頁顯示的記錄數）
    ])
    .then((result) => result.rows)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw createError({
        statusCode: 500,
        message: '無法取得文章列表，請稍候再試'
      })
    })

  return {
    articles: articleRecords,
    page,
    pageSize
  }
})

import { pool } from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)

  const sort = query.sort
  const page = Math.max(parseInt(query.page) || 1, 1)
  const pageSize = Math.min(Math.max(parseInt(query.pageSize) || 10, 1), 100)

  const searchKeyword = query.searchArticle ? `%${query.searchArticle}%` : '%'

  const articleRecords = await pool
    .query(
      `
      SELECT * FROM "article" 
      WHERE "title" ILIKE $1
      ORDER BY "updated_at" ${sort} 
      OFFSET $2 LIMIT $3;
      `,
      [
        searchKeyword, // 用 ILIKE 進行不區分大小寫的模糊搜尋
        (page - 1) * pageSize, // 計算 OFFSET
        pageSize // 設置 LIMIT
      ]
    )
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

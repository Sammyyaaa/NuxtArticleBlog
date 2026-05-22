import { pool } from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)

  const page = Math.max(parseInt(query.page) || 1, 1)
  const pageSize = Math.min(Math.max(parseInt(query.pageSize) || 10, 1), 100)
  const sort = query.sort === 'ASC' ? 'ASC' : 'DESC'

  const articleRecords = await pool
    .query(`SELECT * FROM "article" ORDER BY "updated_at" ${sort} OFFSET $1 LIMIT $2;`, [
      (page - 1) * pageSize,
      pageSize
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

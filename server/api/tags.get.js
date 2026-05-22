import { pool } from '@/server/utils/db'

export default defineEventHandler(async () => {
  const result = await pool
    .query(
      `SELECT DISTINCT unnest(tags) AS tag FROM "article" WHERE array_length(tags, 1) > 0 ORDER BY tag;`
    )
    .then((r) => r.rows.map((row) => row.tag))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw createError({ statusCode: 500, message: '無法取得標籤列表' })
    })

  return result
})

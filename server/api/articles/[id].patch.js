import { pool } from '@/server/utils/db'

export default defineEventHandler(async (event) => {
  // 判斷在 API 中間件 auth.js 加入的 auth 資料物件
  if (event.context?.auth?.user?.id !== 1) {
    throw createError({
      statusCode: 401,
      message: '沒有權限'
    })
  }
  const articleId = await getRouterParam(event, 'id')
  // const body = await readBody(event)

  // 使用 readMultipartFormData 解析 multipart/form-data 請求
  const parts = await readMultipartFormData(event)
  if (!parts) {
    throw createError({
      statusCode: 400,
      message: '請提供表單資料'
    })
  }

  // 從解析結果中取出各個欄位的值
  let title = ''
  let content = ''
  let cover = ''
  let img = null
  let imgFilename = ''

  for (const part of parts) {
    switch (part.name) {
      case 'title':
        // 將 Buffer 轉換成字串（假設使用 utf8 編碼）
        title = part.data.toString('utf8')
        break
      case 'content':
        content = part.data.toString('utf8')
        break
      case 'cover':
        cover = part.data.toString('utf8')
        break
      case 'img':
        // 對於圖片直接保留 Buffer
        img = part.data
        imgFilename = part.filename || ''
        break
    }
  }

  const articleRecord = await pool
    .query(
      'UPDATE "article" SET "title" = $1, "content" = $2, "cover" = $3, "img" = $4, "img_filename" = $5, "updated_at" = NOW() WHERE "id" = $6 RETURNING *',
      [title, content, cover, img, imgFilename, articleId]
    )
    .then((result) => {
      if (result.rowCount === 1) {
        return result.rows?.[0]
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error)
      throw createError({
        statusCode: 500,
        message: '無法更新文章，請稍候再試'
      })
    })

  if (!articleRecord) {
    throw createError({
      statusCode: 400,
      message: '更新文章失敗，請稍候再試'
    })
  }

  return articleRecord
})

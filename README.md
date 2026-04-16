# Nuxt Article Blog

基於 Nuxt 3 建置的文章部落格，包含文章的新增、編輯、刪除與瀏覽，搭配 JWT 驗證保護管理功能，串接 Neon 雲端資料庫儲存文章資料，並部屬在 Vercel，當推送至 GitHub 後自動部署。

## 技術棧

- **框架**：[Nuxt 3](https://nuxt.com/)
- **樣式**：[Tailwind CSS](https://tailwindcss.com/)
- **資料庫**：[Neon](https://neon.tech/)（Serverless PostgreSQL）
- **驗證**：JWT（`jsonwebtoken`）
- **部署**：[Vercel](https://vercel.com/)（推送至 GitHub 後自動部署）
- **其他套件**：`nuxt-icon`、`nuxt-particles`

## 功能

- 文章列表瀏覽（分頁支援）
- 文章詳情頁面
- 文章新增 / 編輯 / 刪除（需登入）
- JWT Cookie 登入驗證
- 路由中介層保護管理頁面

## API 路由

| 方法     | 路徑                | 說明                                        |
| -------- | ------------------- | ------------------------------------------- |
| `GET`    | `/api/articles`     | 取得文章列表（支援 `?page` 與 `?pageSize`） |
| `POST`   | `/api/articles`     | 新增文章                                    |
| `GET`    | `/api/articles/:id` | 取得單篇文章                                |
| `PATCH`  | `/api/articles/:id` | 更新文章                                    |
| `DELETE` | `/api/articles/:id` | 刪除文章                                    |
| `POST`   | `/api/login`        | 登入，寫入 JWT Cookie                       |
| `DELETE` | `/api/session`      | 登出，清除 Cookie                           |
| `GET`    | `/api/whoami`       | 取得目前登入使用者資訊                      |

## 環境變數

在根目錄建立 `.env` 檔案並填入以下變數：

```env
DATABASE_URL=your_neon_database_connection_string
```

> `DATABASE_URL` 可在 [Neon Console](https://console.neon.tech/) 的專案連線資訊中取得。

## 本地開發

安裝依賴：

```bash
npm install
```

啟動開發伺服器（`http://localhost:3000`）：

```bash
npm run dev
```

## 建置與預覽

```bash
# 建置
npm run build

# 預覽正式版本
npm run preview
```

## 部署

本專案透過 **Vercel** 部署。將程式碼推送至 GitHub 後，Vercel 會自動觸發部署流程。

請在 Vercel 專案的環境變數設定中加入 `DATABASE_URL`，確保正式環境可正確連線至 Neon 資料庫。

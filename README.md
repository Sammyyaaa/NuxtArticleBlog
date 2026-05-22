# Nuxt Article Blog

基於 Nuxt 3 建置的文章部落格，支援 Markdown 撰寫、文章標籤分類、圖片輪播，以 Vue Query 管理資料請求與快取，搭配 JWT 驗證保護管理功能，串接 Neon 雲端資料庫，並部署於 Vercel。

## 技術棧

- **框架**：[Nuxt 3](https://nuxt.com/)
- **樣式**：[Tailwind CSS](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)
- **資料庫**：[Neon](https://neon.tech/)（Serverless PostgreSQL）
- **驗證**：JWT（`jsonwebtoken`）
- **部署**：[Vercel](https://vercel.com/)（推送至 GitHub 後自動部署）
- **資料請求**：[TanStack Query（Vue Query）](https://tanstack.com/query/latest)（`@tanstack/vue-query`）— 全域快取管理、useQuery / useMutation、SSR dehydrate/hydrate、removeQueries + prefetchQuery 背景預熱
- **Markdown**：[marked](https://marked.js.org/)
- **其他套件**：`nuxt-icon`、`nuxt-particles`

## 功能

- 文章列表瀏覽（分頁支援）
- 文章搜尋與排序（最新 / 最舊）
- 文章標籤分類（新增/編輯標籤，首頁依標籤篩選）
- 文章詳情頁面（Markdown 渲染）
- 文章圖片輪播（雙圖拖曳/箭頭切換）
- 文章新增 / 編輯 / 刪除（需登入）
- JWT Cookie 登入驗證
- 路由中介層保護管理頁面
- Dark / Light 模式切換

## API 路由

| 方法     | 路徑                | 說明                                                       |
| -------- | ------------------- | ---------------------------------------------------------- |
| `GET`    | `/api/articles`     | 取得文章列表（支援 `?page`、`?pageSize`、`?sort`、`?tag`） |
| `POST`   | `/api/articles`     | 新增文章                                                   |
| `GET`    | `/api/articles/:id` | 取得單篇文章                                               |
| `PATCH`  | `/api/articles/:id` | 更新文章                                                   |
| `DELETE` | `/api/articles/:id` | 刪除文章                                                   |
| `GET`    | `/api/article`      | 關鍵字搜尋文章（支援 `?searchArticle`、`?sort`）           |
| `GET`    | `/api/tags`         | 取得所有不重複標籤                                         |
| `POST`   | `/api/login`        | 登入，寫入 JWT Cookie                                      |
| `DELETE` | `/api/session`      | 登出，清除 Cookie                                          |
| `GET`    | `/api/whoami`       | 取得目前登入使用者資訊                                     |

## 資料請求架構（TanStack Query）

本專案使用 **TanStack Query（Vue Query）** 管理所有 API 請求與快取，取代 Nuxt 內建的 `useFetch` / `$fetch`。

### 為什麼選擇 TanStack Query

| 比較項目      | `useFetch`    | TanStack Query            |
| ------------- | ------------- | ------------------------- |
| 快取範圍      | 元件生命週期  | 全域 QueryClient          |
| 跨元件共享    | ❌ 各自獨立   | ✅ 同 queryKey 共用快取   |
| 背景重新整理  | ❌            | ✅ staleTime 控制         |
| Mutation 管理 | ❌ 需手動處理 | ✅ useMutation + 自動更新 |

### queryKey 設計

每筆快取以陣列形式的 `queryKey` 作為唯一識別，相同的 `queryKey` 在任何元件中都共用同一份資料。

| queryKey          | 對應資料                          | 共用元件                              |
| ----------------- | --------------------------------- | ------------------------------------- |
| `['articles']`    | 文章列表（含分頁/排序/搜尋/標籤） | `pages/index.vue`                     |
| `['article', id]` | 單篇文章                          | `[id].vue`、`edit.vue`                |
| `['whoami']`      | 登入使用者資訊                    | `LayoutHeader.vue`、`[id].vue`        |
| `['tags']`        | 所有不重複標籤                    | `index.vue`、`create.vue`、`edit.vue` |

### 動態 queryKey（Reactive）

首頁文章列表使用 `computed` 包裝 queryKey，當分頁、排序、搜尋關鍵字或標籤篩選任一改變時，TanStack Query 自動偵測並重新 fetch，無需手動呼叫：

```js
queryKey: computed(() => [
  'articles',
  {
    page: currentPage.value,
    sort: activeSort.value,
    search: activeSearch.value,
    tag: activeTag.value
  }
])
```

### 快取更新策略

**`removeQueries` vs `invalidateQueries`**

本專案統一使用 `removeQueries` 而非 `invalidateQueries`：

- `invalidateQueries`：標記為過期，但保留舊資料並背景更新 → 用戶返回首頁時先看到舊內容，有延遲感
- `removeQueries`：完全清除快取 → 首頁掛載時直接 fetch 最新資料，無舊資料閃現

**`prefetchQuery` 背景預熱**

新增/編輯文章後，在導頁到文章詳情頁的同時，呼叫 `prefetchQuery` 在背景預先 fetch 首頁資料（非阻塞）。用戶瀏覽文章頁的時間即是 prefetch 完成的時間，返回首頁時資料已就緒，無載入等待：

```
新增/編輯成功
  ├─ removeQueries（清除舊快取）
  ├─ prefetchQuery（背景 fetch 首頁資料）← 非阻塞
  └─ navigateTo（文章詳情頁）
          ↓ 用戶瀏覽中...
  返回首頁 → 資料已在快取，即時顯示
```

**SSR 支援**

透過 `plugins/vue-query.ts` 的 `dehydrate` / `hydrate` 機制：
伺服器端渲染的查詢結果序列化後隨 HTML 傳送至客戶端，客戶端 hydration 時直接還原快取，避免重複打 API。

## 資料庫 Migration

專案使用 PostgreSQL `TEXT[]` 陣列型態儲存文章標籤。若為全新部署，請在 [Neon Console](https://console.neon.tech/) SQL Editor 執行：

```sql
ALTER TABLE article ADD COLUMN tags TEXT[] DEFAULT '{}';
```

## Markdown 語法支援

撰寫/編輯文章時可使用以下 Markdown 語法，儲存後文章頁自動渲染：

| 語法           | 效果         |
| -------------- | ------------ |
| `# 標題`       | 一到六級標題 |
| `**粗體**`     | **粗體**     |
| `` `程式碼` `` | 行內程式碼   |
| ` ``` `        | 程式碼區塊   |
| `- 項目`       | 無序清單     |
| `1. 項目`      | 有序清單     |
| `> 引用`       | 引用區塊     |

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

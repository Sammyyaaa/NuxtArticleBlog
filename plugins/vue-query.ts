import { VueQueryPlugin, QueryClient, dehydrate, hydrate } from '@tanstack/vue-query'

// plugins/vue-query.ts
// 將 TanStack Query 註冊為 Nuxt plugin，並處理 SSR 的狀態傳遞
// Nuxt 會自動載入 plugins/ 資料夾內的檔案，不需在 nuxt.config.ts 額外設定
export default defineNuxtPlugin((nuxt) => {
  // 建立全域 QueryClient，作為整個應用的快取中心
  // staleTime: 5 分鐘內相同 queryKey 的資料視為新鮮，不重新請求
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5
      }
    }
  })

  // 將 QueryClient 注入 Vue app，讓所有元件可透過 useQueryClient() 取得
  nuxt.vueApp.use(VueQueryPlugin, { queryClient })

  // SSR 階段：頁面渲染完成後，將 QueryClient 的快取狀態序列化（dehydrate）
  // 存入 nuxt.payload，隨 HTML 一起傳送到瀏覽器
  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      nuxt.payload.vueQueryState = dehydrate(queryClient)
    })
  }

  // Client 階段：Vue app 建立時，將 payload 中的快取狀態還原（hydrate）到 QueryClient
  // 讓 useQuery 直接使用 SSR 已抓好的資料，避免進入頁面後重複打 API
  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, nuxt.payload.vueQueryState)
    })
  }
})

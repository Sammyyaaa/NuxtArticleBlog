import { useQueryClient } from '@tanstack/vue-query'

export const useQueryCacheSync = () => {
  const queryClient = useQueryClient()

  const invalidateArticlesAndTags = (articleId = null) => {
    queryClient.removeQueries({ queryKey: ['articles'] })
    queryClient.removeQueries({ queryKey: ['tags'] })
    if (articleId) {
      queryClient.removeQueries({ queryKey: ['article', articleId] })
    }
  }

  // 背景預熱首頁資料：用戶在文章頁停留期間完成 fetch，回首頁即時顯示
  const prefetchHomePageData = () => {
    return Promise.all([
      queryClient.prefetchQuery({
        queryKey: [
          'articles',
          { page: 1, sort: 'DESC', search: '', isSearching: false, tag: null }
        ],
        queryFn: () => $fetch('/api/articles', { query: { page: 1, pageSize: 10, sort: 'DESC' } })
      }),
      queryClient.prefetchQuery({
        queryKey: ['tags'],
        queryFn: () => $fetch('/api/tags')
      })
    ])
  }

  return { invalidateArticlesAndTags, prefetchHomePageData }
}

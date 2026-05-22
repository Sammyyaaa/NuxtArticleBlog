<template>
  <div
    class="flex w-full flex-col items-center"
    :class="{
      ' h-[calc(100vh-65.81px)]': !articlesResponse || articlesResponse.articles.length < 4
    }"
  >
    <!-- 頁首：標題 + 搜尋 -->
    <div class="flex md:items-center mt-10 w-full px-6 lg:px-60 flex-col md:flex-row gap-4">
      <button
        class="flex items-center gap-1 cursor-pointer select-none transition-colors"
        :class="{
          'text-stone-500 hover:text-amber-400': isDark,
          'text-stone-400 hover:text-amber-600': !isDark
        }"
        @click="toggleSort"
      >
        <span class="font-mono text-xs uppercase tracking-widest">
          {{ sortAsc ? 'Oldest' : 'Latest' }}
        </span>
        <Icon :name="sortAsc ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="w-4 h-4" />
      </button>
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2">
        <input
          v-model="searchArticle"
          type="text"
          class="max-w-[300px] w-full md:w-[200px] h-[34px] rounded border px-3 py-1.5 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          :class="{
            'bg-stone-800 border-stone-600 text-stone-100': isDark,
            'bg-white border-stone-300': !isDark
          }"
          placeholder="搜尋文章"
        />
        <BlackAndWhiteButton @click="handleSearch"> 搜尋 </BlackAndWhiteButton>
      </div>
    </div>

    <!-- 標籤篩選列（搜尋列下方） -->
    <div class="mt-4 w-full px-6 lg:px-60 flex flex-wrap gap-2">
      <button
        class="font-mono text-xs px-2.5 py-1 rounded transition-colors"
        :class="
          activeTag === null
            ? 'bg-amber-500 text-white'
            : isDark
              ? 'bg-stone-600 text-stone-300 hover:text-amber-400'
              : 'bg-stone-200 text-stone-600 hover:text-amber-600'
        "
        @click="activeTag = null"
      >
        全部
      </button>
      <button
        v-for="tag in allTags || []"
        :key="tag"
        class="font-mono text-xs px-2.5 py-1 rounded transition-colors"
        :class="
          activeTag === tag
            ? 'bg-amber-500 text-white'
            : isDark
              ? 'bg-stone-600 text-stone-300 hover:text-amber-400'
              : 'bg-stone-200 text-stone-600 hover:text-amber-600'
        "
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <div class="mt-6 mb-10 flex w-full px-6 lg:px-60 flex-col">
      <div v-if="pending" class="flex h-[65vh] items-center justify-center">
        <Icon class="h-12 w-12 text-stone-500" name="eos-icons:loading" />
      </div>
      <template v-else>
        <div v-if="error">
          <span class="text-stone-500">發生錯誤，請稍後再試</span>
          <p class="my-2 text-rose-500">{{ error }}</p>
        </div>
        <div v-else-if="!articlesResponse || articlesResponse.articles.length === 0">
          <span :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }">目前尚無文章</span>
        </div>
        <!-- 分隔線排版 -->
        <div
          v-else
          class="divide-y"
          :class="{ 'divide-stone-700': isDark, 'divide-stone-200': !isDark }"
        >
          <article
            v-for="article in articlesResponse.articles"
            :key="article.id"
            class="py-8 group"
          >
            <NuxtLink class="block" :to="{ name: 'articles-id', params: { id: article.id } }">
              <time
                class="font-mono text-xs uppercase tracking-widest"
                :class="{ 'text-stone-500': isDark, 'text-stone-400': !isDark }"
              >
                {{ date2LocaleString(article.updated_at) }}
              </time>
              <div v-if="article.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="font-mono text-xs px-2 py-0.5 rounded"
                  :class="{
                    'bg-stone-600 text-stone-300': isDark,
                    'bg-stone-200 text-stone-600': !isDark
                  }"
                >
                  {{ tag }}
                </span>
              </div>
              <h2
                class="mt-2 font-serif text-2xl font-normal leading-snug transition-colors"
                :class="{
                  'text-stone-100 group-hover:text-amber-400': isDark,
                  'text-stone-800 group-hover:text-amber-600': !isDark
                }"
              >
                {{ article.title }}
              </h2>
              <p
                class="mt-3 text-sm leading-relaxed line-clamp-2"
                :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
              >
                {{ stripMarkdown(article.content).substring(0, 120) }}
              </p>
              <span
                class="mt-4 inline-flex items-center font-mono text-xs uppercase tracking-wider transition-colors"
                :class="{
                  'text-stone-500 group-hover:text-amber-400': isDark,
                  'text-stone-400 group-hover:text-amber-600': !isDark
                }"
              >
                閱讀文章
                <Icon name="ri:arrow-right-s-line" class="ml-0.5" />
              </span>
            </NuxtLink>
          </article>
        </div>
      </template>

      <!-- 分頁 -->
      <nav v-if="articlesResponse" class="mt-4 flex items-center justify-center gap-6 py-3">
        <NuxtLink
          v-if="currentPage > 1"
          class="font-mono text-xs uppercase tracking-wider transition-colors"
          :class="{
            'text-stone-500 hover:text-amber-400': isDark,
            'text-stone-400 hover:text-amber-600': !isDark
          }"
          :to="{ name: 'index', query: { page: currentPage - 1 } }"
        >
          ← Prev
        </NuxtLink>
        <span
          class="font-mono text-xs"
          :class="{ 'text-stone-500': isDark, 'text-stone-400': !isDark }"
        >
          {{ articlesResponse.page }}
        </span>
        <NuxtLink
          v-if="!isSearching && articlesResponse.articles.length >= articlesResponse.pageSize"
          class="font-mono text-xs uppercase tracking-wider transition-colors"
          :class="{
            'text-stone-500 hover:text-amber-400': isDark,
            'text-stone-400 hover:text-amber-600': !isDark
          }"
          :to="{ name: 'index', query: { page: currentPage + 1 } }"
        >
          Next →
        </NuxtLink>
      </nav>
    </div>

    <!-- 固定在右下角的 Top 按鈕 -->
    <TopButton />
  </div>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query'

const route = useRoute()
const currentPage = computed(() => parseInt(route?.query?.page) || 1)
const isDark = useDark()
const searchArticle = ref('')
const isSearching = ref(false)
const sortAsc = ref(false)
const activeSearch = ref('')
const activeSort = ref('DESC')
const activeTag = ref(null)

// ─── useQuery: 所有標籤 ──────────────────────────────────────────────────────
// queryKey: ['tags']
// 取得資料庫中所有不重複的標籤，顯示在搜尋列下方作為篩選按鈕。
// 在新增/編輯/刪除文章的 mutation 成功後，此快取會被 removeQueries 清除，
// 確保標籤列表永遠是最新狀態。
const { data: allTags } = useQuery({
  queryKey: ['tags'],
  queryFn: () => $fetch('/api/tags')
})

// ─── useQuery: 文章列表 ──────────────────────────────────────────────────────
// queryKey: ['articles', { page, search, sort, isSearching, tag }]
//
// 核心設計：queryKey 使用 computed，包含所有影響查詢結果的狀態。
// 當任何一個 ref（分頁/搜尋/排序/標籤篩選）改變時，queryKey 隨之變化，
// TanStack Query 自動偵測到新的 key 並重新 fetch，無需手動呼叫。
//
// queryFn 根據是否為搜尋模式選擇不同的 endpoint：
//   - 一般瀏覽 → GET /api/articles（支援分頁 + 排序 + 標籤篩選）
//   - 關鍵字搜尋 → GET /api/article（支援 ILIKE 全文搜尋 + 排序）
const {
  isPending: pending,
  data: articlesResponse,
  error
} = useQuery({
  queryKey: computed(() => [
    'articles',
    {
      page: isSearching.value ? 1 : currentPage.value,
      search: activeSearch.value,
      sort: activeSort.value,
      isSearching: isSearching.value,
      tag: activeTag.value
    }
  ]),
  queryFn: () => {
    if (isSearching.value && activeSearch.value !== '') {
      return $fetch('/api/article', {
        query: {
          page: 1,
          pageSize: 10,
          sort: activeSort.value,
          searchArticle: activeSearch.value
        }
      })
    }
    return $fetch('/api/articles', {
      query: {
        page: currentPage.value,
        pageSize: 10,
        sort: activeSort.value,
        tag: activeTag.value
      }
    })
  }
})

const date2LocaleString = (date) => {
  return new Date(date).toLocaleString()
}

const stripMarkdown = (text = '') =>
  text
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_`>![\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()

const toggleSort = () => {
  sortAsc.value = !sortAsc.value
  activeSort.value = sortAsc.value ? 'ASC' : 'DESC'
}

// 來自 pages/index.vue
// 原本: $fetch 搜尋後直接 articlesResponse.value = data（手動寫入）
// 改為: 更新 activeSearch / activeSort / isSearching ref，queryKey 變動觸發自動 refetch
const handleSearch = () => {
  if (searchArticle.value === '') {
    isSearching.value = false
    activeSearch.value = ''
    navigateTo('/', { replace: true })
    return
  }
  activeSort.value = sortAsc.value ? 'ASC' : 'DESC'
  activeSearch.value = searchArticle.value.trim()
  isSearching.value = true
}
</script>

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
        :class="{ 'text-stone-500 hover:text-amber-400': isDark, 'text-stone-400 hover:text-amber-600': !isDark }"
        @click="toggleSort"
      >
        <span class="font-mono text-xs uppercase tracking-widest">
          {{ sortAsc ? 'Oldest' : 'Latest' }}
        </span>
        <Icon
          :name="sortAsc ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
          class="w-4 h-4"
        />
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
          <article v-for="article in articlesResponse.articles" :key="article.id" class="py-8 group">
            <NuxtLink class="block" :to="{ name: 'articles-id', params: { id: article.id } }">
              <time
                class="font-mono text-xs uppercase tracking-widest"
                :class="{ 'text-stone-500': isDark, 'text-stone-400': !isDark }"
              >
                {{ date2LocaleString(article.updated_at) }}
              </time>
              <h2
                class="mt-3 font-serif text-2xl font-normal leading-snug transition-colors"
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
                {{ article.content?.replace(/\n/g, ' ').substring(0, 120) }}
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
          :class="{ 'text-stone-500 hover:text-amber-400': isDark, 'text-stone-400 hover:text-amber-600': !isDark }"
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
          :class="{ 'text-stone-500 hover:text-amber-400': isDark, 'text-stone-400 hover:text-amber-600': !isDark }"
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
// 追蹤實際套用的搜尋關鍵字與排序，與輸入框的 searchArticle 分開
// 點下搜尋才更新，避免每次輸入都觸發 query
const activeSearch = ref('')
const activeSort = ref('DESC')

// 來自 pages/index.vue
// 原本: await useFetch('/api/articles', { query: { page, pageSize } })
//      搜尋時用 $fetch('/api/article', ...) 手動覆寫 articlesResponse.value
// 改為: 單一 useQuery，queryKey 包含 page / isSearching / activeSearch / activeSort
//      任一 ref 改變，TanStack Query 自動選擇正確的 endpoint 重新 fetch
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
      isSearching: isSearching.value
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
        sort: activeSort.value
      }
    })
  }
})

const date2LocaleString = (date) => {
  return new Date(date).toLocaleString()
}

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

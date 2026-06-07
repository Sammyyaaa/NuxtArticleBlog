<template>
  <div
    class="flex w-full flex-col items-center"
    :class="{
      'h-[calc(100vh-65.81px)]': !articlesResponse || articlesResponse.articles.length < 4
    }"
  >
    <!-- 搜尋與排序列 -->
    <div class="flex md:items-center w-full px-6 lg:px-20 flex-col md:flex-row gap-4 mt-8 mb-4">
      <!-- 排序按鈕 -->
      <button
        class="flex items-center gap-1.5 cursor-pointer select-none transition-colors"
        :class="{
          'text-luxury-warm-gray hover:text-luxury-gold': isDark,
          'text-luxury-light-muted hover:text-luxury-gold-dark': !isDark
        }"
        @click="toggleSort"
      >
        <span class="font-mono text-xs uppercase tracking-[0.15em]">
          {{ sortAsc ? 'Oldest' : 'Latest' }}
        </span>
        <!-- 上箭頭 -->
        <svg
          v-if="sortAsc"
          class="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
        <!-- 下箭頭 -->
        <svg
          v-else
          class="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- 搜尋欄 -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-2 md:ml-auto">
        <input
          v-model="searchArticle"
          type="text"
          class="max-w-[300px] w-full md:w-[200px] h-[34px] bg-transparent border-b px-0 py-1 text-sm focus:outline-none transition-colors"
          :class="{
            'border-luxury-warm-gray/60 text-luxury-cream placeholder-luxury-warm-gray/70 focus:border-luxury-gold':
              isDark,
            'border-stone-400 text-luxury-light-text placeholder-stone-400 focus:border-luxury-gold-dark':
              !isDark
          }"
          placeholder="搜尋文章"
          @keydown.enter="handleSearch"
        />
        <button
          class="font-mono text-xs uppercase tracking-[0.12em] px-4 py-1.5 border transition-colors"
          :class="{
            'border-luxury-warm-gray/55 text-luxury-warm-gray hover:border-luxury-gold hover:text-luxury-gold':
              isDark,
            'border-stone-400 text-stone-600 hover:border-luxury-gold-dark hover:text-luxury-gold-dark':
              !isDark
          }"
          @click="handleSearch"
        >
          搜尋
        </button>
      </div>
    </div>

    <!-- 標籤篩選列 -->
    <div class="mb-8 w-full px-6 lg:px-20 flex flex-wrap gap-2">
      <button
        class="font-mono text-xs uppercase tracking-wider px-3 py-1 border transition-all duration-200"
        :class="
          activeTag === null
            ? isDark
              ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/8'
              : 'border-luxury-gold-dark text-luxury-gold-dark bg-luxury-gold/8'
            : isDark
              ? 'border-luxury-warm-gray/55 text-luxury-warm-gray hover:border-luxury-gold/80 hover:text-luxury-gold'
              : 'border-stone-400 text-stone-600 hover:border-luxury-gold-dark hover:text-luxury-gold-dark'
        "
        @click="activeTag = null"
      >
        All
      </button>
      <button
        v-for="tag in allTags || []"
        :key="tag"
        class="font-mono text-xs uppercase tracking-wider px-3 py-1 border transition-all duration-200"
        :class="
          activeTag === tag
            ? isDark
              ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/8'
              : 'border-luxury-gold-dark text-luxury-gold-dark bg-luxury-gold/8'
            : isDark
              ? 'border-luxury-warm-gray/55 text-luxury-warm-gray hover:border-luxury-gold/80 hover:text-luxury-gold'
              : 'border-stone-400 text-stone-600 hover:border-luxury-gold-dark hover:text-luxury-gold-dark'
        "
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- 文章列表 -->
    <div class="mb-10 flex w-full px-6 lg:px-20 flex-col">
      <!-- 載入中 -->
      <div v-if="pending" class="flex h-[50vh] items-center justify-center">
        <svg
          class="h-8 w-8 text-luxury-gold/50 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>

      <template v-else>
        <!-- 錯誤 -->
        <div v-if="error">
          <span :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }">
            發生錯誤，請稍後再試
          </span>
          <p class="my-2 text-rose-500">{{ error }}</p>
        </div>

        <!-- 空列表 -->
        <div v-else-if="!articlesResponse || articlesResponse.articles.length === 0">
          <span :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }">
            目前尚無文章
          </span>
        </div>

        <!-- 文章列 -->
        <div
          v-else
          class="divide-y"
          :class="{ 'divide-luxury-warm-border': isDark, 'divide-luxury-light-border': !isDark }"
        >
          <article
            v-for="article in articlesResponse.articles"
            :key="article.id"
            class="group relative"
          >
            <!-- 金色左邊緣 highlight（absolute 方式，不受 divide-y 影響） -->
            <div
              class="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              :class="{ 'bg-luxury-gold': isDark, 'bg-luxury-gold-dark': !isDark }"
            />

            <NuxtLink
              class="flex py-8 pl-0 group-hover:pl-4 transition-all duration-300"
              :to="{ name: 'articles-id', params: { id: article.id } }"
            >
              <!-- 文字區 -->
              <div class="flex-1 flex flex-col justify-center min-w-0">
                <time
                  class="font-mono text-xs uppercase tracking-[0.15em]"
                  :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }"
                >
                  {{ formatDateToTaipei(article.updated_at) }}
                </time>

                <div v-if="article.tags?.length" class="mt-2.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="font-mono text-xs px-2 py-0.5 border transition-colors duration-300"
                    :class="{
                      'border-luxury-warm-border text-luxury-warm-gray group-hover:border-luxury-gold/40 group-hover:text-luxury-gold':
                        isDark,
                      'border-luxury-light-border text-luxury-light-muted group-hover:border-luxury-gold-dark/40 group-hover:text-luxury-gold-dark':
                        !isDark
                    }"
                  >
                    {{ tag }}
                  </span>
                </div>

                <h2
                  class="mt-3 font-serif text-xl md:text-2xl font-normal leading-snug transition-colors duration-300"
                  :class="{
                    'text-luxury-cream group-hover:text-luxury-gold': isDark,
                    'text-luxury-light-text group-hover:text-luxury-gold-dark': !isDark
                  }"
                >
                  {{ article.title }}
                </h2>

                <p
                  class="mt-2 text-sm md:text-base leading-relaxed line-clamp-2"
                  :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }"
                >
                  {{ stripMarkdown(article.content).substring(0, 120) }}
                </p>

                <span
                  class="mt-4 md:inline-flex hidden items-center font-mono text-xs uppercase tracking-wider opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  :class="{
                    'text-luxury-gold': isDark,
                    'text-luxury-gold-dark': !isDark
                  }"
                >
                  閱讀文章
                  <svg
                    class="ml-1 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </template>

      <!-- 分頁 -->
      <nav v-if="articlesResponse" class="mt-8 flex items-center justify-center gap-8 py-3">
        <NuxtLink
          v-if="currentPage > 1"
          class="font-mono text-xs uppercase tracking-[0.15em] transition-colors"
          :class="{
            'text-luxury-warm-gray hover:text-luxury-gold': isDark,
            'text-luxury-light-muted hover:text-luxury-gold-dark': !isDark
          }"
          :to="{ name: 'index', query: { page: currentPage - 1 } }"
        >
          ← Prev
        </NuxtLink>

        <div class="flex items-center gap-3">
          <div
            class="w-6 h-px"
            :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
          />
          <span class="font-mono text-xs text-luxury-gold">{{ articlesResponse.page }}</span>
          <div
            class="w-6 h-px"
            :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
          />
        </div>

        <NuxtLink
          v-if="!isSearching && articlesResponse.articles.length >= articlesResponse.pageSize"
          class="font-mono text-xs uppercase tracking-[0.15em] transition-colors"
          :class="{
            'text-luxury-warm-gray hover:text-luxury-gold': isDark,
            'text-luxury-light-muted hover:text-luxury-gold-dark': !isDark
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
const {
  searchArticle,
  isSearching,
  sortAsc,
  activeSearch,
  activeSort,
  activeTag,
  toggleSort,
  handleSearch
} = useArticleFiltering()
const { formatDateToTaipei } = useDateFormatter()
const { stripMarkdown } = useMarkdownUtils()

// ─── useQuery: 所有標籤 ──────────────────────────────────────────────────────
const { data: allTags } = useQuery({
  queryKey: ['tags'],
  queryFn: () => $fetch('/api/tags')
})

// ─── useQuery: 文章列表 ──────────────────────────────────────────────────────
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
</script>

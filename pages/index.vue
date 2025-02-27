<template>
  <div
    class="flex w-full flex-col items-center"
    :class="{
      'bg-gray-800 ': isDark,
      ' h-[calc(100vh-65.81px)]': !articlesResponse || articlesResponse.articles.length < 4
    }"
  >
    <div class="flex md:items-center mt-8 w-full px-6 lg:px-60 flex-col md:flex-row">
      <div class="flex items-center justuify-center">
        <h1
          class="text-3xl font-semibold"
          :class="{ 'text-gray-400': isDark, 'text-gray-800': !isDark }"
        >
          {{ sortAsc ? '較舊文章' : '最新文章' }}
        </h1>
        <Icon
          :name="sortAsc ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
          class="w-[18px] h-[18px] ml-2 cursor-pointer"
          :class="{
            'text-gray-400': isDark,
            'text-gray-800': !isDark
          }"
          @click="toggleSort"
        />
      </div>
      <div class="flex flex-col md:flex-row items-start md:items-center mt-3 md:mx-10 md:mt-0">
        <input
          v-model="searchArticle"
          type="text"
          class="max-w-[300px] w-full md:w-[210px] h-[35px] rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          :class="{
            'bg-gray-800 border-gray-600 text-white': isDark,
            'border-gray-300': !isDark
          }"
          placeholder="搜尋文章"
        />
        <div class="flex max-w-[300px] w-full md:ml-2 mt-2 md:mt-0 justify-end md:justify-start">
          <BlackAndWhiteButton @click="handleSearch"> 搜尋 </BlackAndWhiteButton>
        </div>
      </div>
    </div>
    <div class="my-8 flex w-full px-6 lg:px-60 flex-col">
      <div v-if="pending">
        <Icon class="h-6 w-6 text-gray-500" name="eos-icons:loading" />
      </div>
      <template v-else>
        <div v-if="error">
          <span class="text-gray-500">發生錯誤，請稍後再試</span>
          <p class="my-2 text-rose-500">{{ error }}</p>
        </div>
        <div v-else-if="!articlesResponse || articlesResponse.articles.length === 0">
          <span :class="{ 'text-gray-400': isDark, 'text-gray-600': !isDark }"
            >目前尚無最新文章</span
          >
        </div>
        <div
          v-else
          class="md:border-l md:border-gray-200"
          :class="{ 'md:border-gray-600': isDark }"
        >
          <div class="flex flex-col space-y-4 md:pl-6">
            <article
              v-for="article in articlesResponse.articles"
              :key="article.id"
              class="flex flex-col md:flex-row md:items-baseline"
            >
              <NuxtLink
                class="group md:ml-8 pl-2 flex cursor-pointer flex-col items-start pb-6 pt-1 transition"
                :class="{ 'hover:bg-gray-700': isDark, 'hover:bg-gray-100': !isDark }"
                :to="{
                  name: 'articles-id',
                  params: {
                    id: article.id
                  }
                }"
              >
                <h2
                  class="text-base font-semibold tracking-tight"
                  :class="{ 'text-gray-400': isDark, 'text-gray-700': !isDark }"
                >
                  <span>{{ article.title }}</span>
                </h2>
                <time class="order-first mb-3 flex items-center text-sm text-gray-400 md:hidden">
                  {{ date2LocaleString(article.updated_at) }}
                </time>
                <p
                  class="mt-2 text-sm max-w-[300px]"
                  :class="{ 'text-gray-400': isDark, 'text-gray-500': !isDark }"
                >
                  {{ article.content?.replace(/\n/g, ' ').substring(0, 50) }}...
                </p>
                <span
                  aria-hidden="true"
                  class="mt-4 flex items-center text-sm font-medium text-emerald-500"
                >
                  繼續閱讀
                  <Icon name="ri:arrow-right-s-line" />
                </span>
              </NuxtLink>
              <time
                class="order-first mb-3 ml-3 mr-6 hidden items-center text-sm text-gray-400 md:flex"
              >
                {{ date2LocaleString(article.updated_at) }}
              </time>
            </article>
          </div>
        </div>
      </template>

      <nav v-if="articlesResponse" class="mt-2 flex items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-center sm:justify-end">
          <NuxtLink
            v-if="currentPage > 1"
            class="flex items-center text-xl font-medium text-gray-400 hover:text-emerald-500"
            :to="{
              name: 'index',
              query: {
                page: currentPage - 1
              }
            }"
          >
            <Icon name="ri:arrow-left-s-line" />
          </NuxtLink>
          <label class="mx-2 text-sm" :class="{ 'text-gray-400': isDark, 'text-gray-600': !isDark }"
            >第 {{ articlesResponse.page }} 頁</label
          >
          <NuxtLink
            v-if="!isSearching"
            class="flex items-center text-xl font-medium text-gray-400 hover:text-emerald-500"
            :to="{
              name: 'index',
              query: {
                page: currentPage + 1
              }
            }"
          >
            <Icon name="ri:arrow-right-s-line" />
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- 固定在右下角的 Top 按鈕 -->
    <TopButton />
  </div>
</template>

<script setup>
const route = useRoute()
const currentPage = computed(() => parseInt(route?.query?.page) || 1)
const {
  pending,
  data: articlesResponse,
  error
} = await useFetch('/api/articles', {
  query: {
    page: currentPage,
    pageSize: 10
  }
})
const isDark = useState('isDark')
const searchArticle = ref('')
const isSearching = ref(false)
const sortAsc = ref(false)

const date2LocaleString = (date) => {
  return new Date(date).toLocaleString()
}

const toggleSort = () => {
  sortAsc.value = !sortAsc.value
  handleSearch()
}

const handleSearch = async () => {
  const order = sortAsc.value ? 'ASC' : 'DESC'
  isSearching.value = true
  if (searchArticle.value === '') {
    isSearching.value = false
    navigateTo('/', { replace: true })
  }

  // const page = currentPage.value
  const data = await $fetch('/api/article', {
    query: {
      page: 1,
      pageSize: 10,
      sort: order,
      searchArticle: searchArticle.value.trim()
    }
  })

  articlesResponse.value = data
}

watch(articlesResponse, (newArticlesResponse) => {
  currentPage.value = newArticlesResponse.page
})
</script>

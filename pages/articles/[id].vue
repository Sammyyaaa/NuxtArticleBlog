<template>
  <div class="flex w-full flex-col items-center min-h-[calc(100vh-65.81px)]">
    <!-- 加載中 -->
    <div v-if="!article.title" class="pt-6">
      <Icon class="h-12 w-12 text-gray-300" name="eos-icons:bubble-loading" />
    </div>
    <template v-else>
      <!-- 錯誤提示 -->
      <div v-if="error" class="my-4">
        <span class="text-gray-500">發生了一點錯誤，請稍後再嘗試</span>
        <p class="my-2 text-rose-500">{{ error }}</p>
      </div>
      <!-- 顯示文章內容 -->
      <div
        v-else-if="article.title"
        class="mb-8 flex w-full flex-col justify-center md:max-w-3xl px-6 md:px-0"
      >
        <!-- 只有圖片網址 -->
        <div v-if="article.cover && !imageUrl" class="mt-4 flex justify-center">
          <img
            :src="article.cover"
            alt="圖片網址"
            class="h-[300px] md:h-[450px] rounded-xl shadow-md"
            @error="onImageError"
          />
        </div>
        <!-- 圖片網址 && 圖片檔案 -->
        <div
          v-else-if="article.cover && imageUrl"
          class="mt-4 relative flex flex-col md:flex-row justify-center items-center group w-full md:h-[500px]"
        >
          <img
            :src="article.cover ? article.cover : imageUrl"
            alt="圖片網址"
            class="md:absolute md:top-0 md:left-0 h-[300px] md:h-[420px] md:w-[700px] object-cover md:transition-transform rounded-xl shadow-md duration-300 md:z-20 md:group-hover:z-10 md:group-hover:translate-x-[70px] md:group-hover:translate-y-[70px] hidden md:block group-hover:block"
            @error="onImageError"
          />
          <img
            :src="imageUrl ? imageUrl : article.cover"
            alt="圖片檔案"
            class="md:absolute md:top-[75px] md:right-0 h-[300px] md:h-[420px] md:w-[700px] object-cover md:transition-transform rounded-xl shadow-md duration-300 md:z-10 md:group-hover:z-20 md:group-hover:-translate-x-[70px] md:group-hover:-translate-y-[70px] max-md:group-hover:hidden"
            @error="onImageError"
          />
        </div>
        <!-- 只有圖片檔案 -->
        <div v-else-if="!article.cover && imageUrl" class="mt-4 flex justify-center">
          <img
            :src="imageUrl"
            alt="圖片檔案"
            class="h-[300px] md:h-[450px] rounded-xl shadow-md"
            @error="onImageError"
          />
        </div>
        <!-- 都沒有圖片時 -->
        <div v-else class="mt-4 flex justify-center">
          <img src="/public/article-img.png" class="h-[300px] md:h-[450px] rounded-xl shadow-md" />
        </div>

        <div class="my-2 flex flex-col justify-between sm:my-0 sm:flex-row sm:items-center">
          <time class="my-2 text-sm text-gray-400">
            {{ new Date(article.updated_at).toLocaleString() }}
          </time>
          <!-- 判斷登入時才會顯示刪除文章按鈕 || 編輯連結-->
          <div v-if="userInfo?.id === 1" class="flex-row flex gap-3">
            <!-- 編輯連結 -->
            <NuxtLink
              class="flex items-center text-sm text-gray-400 hover:font-semibold hover:text-emerald-500"
              :to="{
                name: 'articles-edit',
                query: {
                  id: route.params.id
                }
              }"
            >
              <Icon class="mr-1 h-4 w-4" name="ri:edit-line" />
              編輯
            </NuxtLink>
            <!-- 刪除按鈕 -->
            <button
              class="flex items-center text-sm text-gray-400 hover:font-semibold hover:text-rose-500"
              @click="handleDeleteArticle"
            >
              <Icon class="mr-1 h-4 w-4" name="ri:delete-bin-line" />
              刪除
            </button>
          </div>
        </div>

        <h1
          class="break-words text-4xl font-semibold"
          :class="{ 'text-gray-400 ': isDark, 'text-gray-500': !isDark }"
        >
          {{ article.title }}
        </h1>
        <div
          class="mt-6 break-words whitespace-pre-line"
          :class="{ 'text-gray-400': isDark, 'text-gray-700': !isDark }"
        >
          {{ article.content }}
        </div>
        <div class="flex justify-end mt-5">
          <BlackAndWhiteButton :height="37.81" :width="61.82">
            <NuxtLink to="/" class="absolute inset-0 flex items-center justify-center">
              回首頁
            </NuxtLink>
          </BlackAndWhiteButton>
        </div>
      </div>
    </template>
    <!-- 固定在右下角的 Top 按鈕 -->
    <TopButton />
  </div>
</template>

<script setup>
const route = useRoute()
// console.log(route.params.id)
const imageUrl = ref('')
const userInfo = useState('userInfo')
const isDark = useDark()
const article = reactive({
  title: '',
  content: '',
  cover: '',
  img: null,
  img_filename: ''
})
const { data, error } = await useFetch(`/api/articles/${route.params.id}`)

onMounted(() => {
  Object.assign(article, data.value)
  // console.log(article)
  if (article && article.img && article.img.data) {
    // 將 Buffer 陣列轉換成 Uint8Array
    const uint8Arr = new Uint8Array(article.img.data)
    // 建立 Blob，使用回傳的 MIME type，若無則預設 image/jpeg
    const blob = new Blob([uint8Arr], { type: article.img.type || 'image/jpeg' })
    // 建立臨時 URL
    imageUrl.value = URL.createObjectURL(blob)
  }
})

function onImageError(event) {
  event.target.src = '/article-img.png'
}

const handleDeleteArticle = () => {
  const answer = confirm('你確定要刪除文章嗎')

  if (answer) {
    $fetch(`/api/articles/${route.params.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        navigateTo('/')
      })
      .catch((error) => {
        // console.log(error)
        alert(error)
      })
  }
}

useHead({
  // 使用響應式資料
  // title: article.title

  // 使用函式顯示組合字串模板
  title: () => `Article Blog No.${route.params.id} | ${article.title}`
})

// 避免 SEO 時，description 中過長文章內容，只顯示前 300 字
const description = article.content.replace(/\n/g, '  ').slice(0, 300)

// 建立該頁面的 SEO 相關 meta 標籤
useSeoMeta({
  // description: article.content,
  description, // 顯示前 300 字的文章內容
  ogTitle: article.title,
  ogDescription: description,
  ogImage: article.cover,
  ogUrl: () => `http://localhost:3000/articles/${article.id}`,
  twitterTitle: article.title,
  twitterDescription: description,
  twitterImage: article.cover,
  twittergUrl: () => `http://localhost:3000/articles/${article.id}`,
  twitterCard: 'summary_large_image'
})
</script>

<style scoped>
@media (min-width: 768px) {
  .md\:transition-transform {
    transition-property: transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
}
</style>

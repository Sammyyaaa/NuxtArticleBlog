<template>
  <div class="flex w-full flex-col items-center min-h-[calc(100vh-65.81px)]">

    <!-- 載入中 -->
    <div v-if="!article.title" class="flex h-[60vh] items-center justify-center">
      <Icon class="h-10 w-10 text-stone-400" name="eos-icons:bubble-loading" />
    </div>

    <template v-else>
      <!-- 錯誤 -->
      <div v-if="error" class="my-8 px-6 text-center">
        <span class="text-stone-500">發生了一點錯誤，請稍後再嘗試</span>
        <p class="my-2 text-rose-500">{{ error }}</p>
      </div>

      <article v-else-if="article.title" class="w-full">

        <!-- ① 封面圖 -->

        <!-- 雙圖輪播：左右按鈕 + 拖曳 + 無限循環 -->
        <div v-if="article.cover && imageUrl" class="mx-auto w-full max-w-2xl px-6">
          <!--
            事件綁在容器而非 track，確保 track 平移後仍能捕捉拖曳
            容器設定明確高度，讓 absolute 按鈕定位正確
          -->
          <div
            class="relative w-full h-[280px] md:h-[380px] overflow-hidden rounded-xl select-none"
            :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
            @mousedown="startDrag"
            @mousemove="moveDrag"
            @mouseup="endDrag"
            @mouseleave="endDrag"
            @touchstart.passive="startDrag"
            @touchmove.prevent="moveDrag"
            @touchend="endDrag"
          >
            <!-- Track：純視覺，不綁事件 -->
            <div
              class="flex h-full w-full"
              :style="{
                transform: `translateX(calc(${-frontIndex * 100}% + ${dragOffset}px))`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }"
            >
              <img
                :src="article.cover"
                alt="封面圖"
                class="w-full h-full flex-shrink-0 object-contain pointer-events-none"
                @error="onImageError"
              />
              <img
                :src="imageUrl"
                alt="上傳圖"
                class="w-full h-full flex-shrink-0 object-contain pointer-events-none"
                @error="onImageError"
              />
            </div>

            <!-- 左箭頭 -->
            <button
              v-if="frontIndex > 0"
              class="absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10"
              :class="isDark ? 'text-stone-400 hover:text-amber-400' : 'text-stone-500 hover:text-amber-600'"
              @click.stop="frontIndex = 0"
            >
              <Icon name="ri:arrow-left-s-line" class="h-8 w-8" />
            </button>

            <!-- 右箭頭 -->
            <button
              v-if="frontIndex < 1"
              class="absolute right-4 top-1/2 -translate-y-1/2 transition-colors z-10"
              :class="isDark ? 'text-stone-400 hover:text-amber-400' : 'text-stone-500 hover:text-amber-600'"
              @click.stop="frontIndex = 1"
            >
              <Icon name="ri:arrow-right-s-line" class="h-8 w-8" />
            </button>

            <!-- 指示點 -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <button
                v-for="i in 2" :key="i"
                class="h-1.5 rounded-full transition-all duration-300"
                :class="[frontIndex === i - 1 ? 'w-5 bg-amber-500' : 'w-1.5', isDark ? 'bg-stone-500' : 'bg-stone-400']"
                @click.stop="frontIndex = i - 1"
              />
            </div>
          </div>
        </div>

        <!-- 單張圖 -->
        <div v-else-if="article.cover || imageUrl" class="mx-auto w-full max-w-2xl px-6">
          <div class="w-full h-[280px] md:h-[380px] rounded-xl overflow-hidden">
            <img
              :src="article.cover || imageUrl"
              alt="封面圖"
              class="w-full h-full object-contain"
              @error="onImageError"
            />
          </div>
        </div>

        <!-- ② 文章標頭：date → title → 分隔線 -->
        <div class="mx-auto w-full max-w-2xl px-6 mt-12">
          <div class="flex items-center justify-between">
            <time class="font-mono text-xs uppercase tracking-widest text-stone-400">
              {{ new Date(article.updated_at).toLocaleString() }}
            </time>
            <!-- 編輯 / 刪除（管理員） -->
            <div v-if="userInfo?.id === 1" class="flex gap-4">
              <NuxtLink
                class="flex items-center font-mono text-xs uppercase tracking-wider text-stone-400 transition-colors hover:text-amber-500"
                :to="{ name: 'articles-edit', query: { id: route.params.id } }"
              >
                <Icon class="mr-1 h-3.5 w-3.5" name="ri:edit-line" />
                編輯
              </NuxtLink>
              <button
                class="flex items-center font-mono text-xs uppercase tracking-wider text-stone-400 transition-colors hover:text-rose-500"
                @click="handleDeleteArticle"
              >
                <Icon class="mr-1 h-3.5 w-3.5" name="ri:delete-bin-line" />
                刪除
              </button>
            </div>
          </div>

          <!-- 標籤 -->
          <div v-if="article.tags?.length" class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="font-mono text-xs px-2.5 py-0.5 rounded"
              :class="{ 'bg-stone-600 text-stone-300': isDark, 'bg-stone-200 text-stone-600': !isDark }"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 大標題 -->
          <h1
            class="mt-6 break-words font-serif text-4xl md:text-5xl font-normal leading-tight tracking-tight"
            :class="{ 'text-stone-100': isDark, 'text-stone-800': !isDark }"
          >
            {{ article.title }}
          </h1>

          <!-- 裝飾分隔線 -->
          <div class="mt-10 flex items-center gap-4">
            <div class="h-px flex-1" :class="{ 'bg-stone-700': isDark, 'bg-stone-200': !isDark }" />
            <span class="text-amber-500 text-lg">✦</span>
            <div class="h-px flex-1" :class="{ 'bg-stone-700': isDark, 'bg-stone-200': !isDark }" />
          </div>
        </div>

        <!-- ③ 文章內文 -->
        <div class="mx-auto w-full max-w-2xl px-6 mt-10 mb-16">
          <div
            class="prose prose-stone max-w-none text-[17px] leading-9"
            :class="isDark ? 'prose-invert' : ''"
            v-html="renderedContent"
          />

          <!-- 底部分隔線 + 回首頁 -->
          <div class="mt-14 flex items-center gap-4">
            <div class="h-px flex-1" :class="{ 'bg-stone-700': isDark, 'bg-stone-200': !isDark }" />
            <span class="text-amber-500 text-lg">✦</span>
            <div class="h-px flex-1" :class="{ 'bg-stone-700': isDark, 'bg-stone-200': !isDark }" />
          </div>
          <div class="mt-8 flex justify-center">
            <NuxtLink
              to="/"
              class="font-mono text-xs uppercase tracking-widest transition-colors"
              :class="{ 'text-stone-500 hover:text-amber-400': isDark, 'text-stone-400 hover:text-amber-600': !isDark }"
            >
              ← 返回文章列表
            </NuxtLink>
          </div>
        </div>

      </article>
    </template>

    <TopButton />
  </div>
</template>

<script setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { marked } from 'marked'

const route = useRoute()
const imageUrl = ref('')

const frontIndex = ref(0) // 0 = cover URL，1 = 上傳圖
const dragOffset = ref(0)
const isDragging = ref(false)
let dragStartX = 0
const DRAG_THRESHOLD = 50

const startDrag = (e) => {
  isDragging.value = true
  dragStartX = 'touches' in e ? e.touches[0].clientX : e.clientX
  dragOffset.value = 0
}

const moveDrag = (e) => {
  if (!isDragging.value) return
  const x = 'touches' in e ? e.touches[0].clientX : e.clientX
  dragOffset.value = x - dragStartX
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value < -DRAG_THRESHOLD && frontIndex.value === 0) {
    frontIndex.value = 1
  } else if (dragOffset.value > DRAG_THRESHOLD && frontIndex.value === 1) {
    frontIndex.value = 0
  }
  dragOffset.value = 0
}
const isDark = useDark()
const queryClient = useQueryClient()

// ─── useQuery: 登入使用者 ────────────────────────────────────────────────────
// queryKey: ['whoami']（與 LayoutHeader 相同）
// 相同的 queryKey 會共用快取：若 Header 已請求過，此處直接讀快取，不重打 API。
// 用於判斷是否顯示「編輯/刪除」按鈕（只有 id === 1 的使用者才能看到）。
const { data: userInfo } = useQuery({
  queryKey: ['whoami'],
  queryFn: () => $fetch('/api/whoami')
})

const article = reactive({
  title: '',
  content: '',
  cover: '',
  img: null,
  img_filename: ''
})

// ─── useQuery: 單篇文章 ──────────────────────────────────────────────────────
// queryKey: ['article', id]（與 edit.vue 相同）
// 若使用者先瀏覽過文章再點「編輯」，edit.vue 可直接讀此快取，無需重新 fetch。
// 用 watch(data, { immediate: true }) 取代 onMounted：
//   - immediate: true 讓快取已存在時也能立即觸發同步
//   - 一般 onMounted 在 SSR hydration 階段不一定能拿到非同步資料
const { data, error } = useQuery({
  queryKey: ['article', route.params.id],
  queryFn: () => $fetch(`/api/articles/${route.params.id}`)
})

watch(
  data,
  (newData) => {
    if (!newData) return
    Object.assign(article, newData)
    if (article.img?.data) {
      // 將 Buffer 陣列轉換成 Uint8Array
      const uint8Arr = new Uint8Array(article.img.data)
      // 建立 Blob，使用回傳的 MIME type，若無則預設 image/jpeg
      const blob = new Blob([uint8Arr], { type: article.img.type || 'image/jpeg' })
      // 建立臨時 URL
      imageUrl.value = URL.createObjectURL(blob)
    }
  },
  { immediate: true }
)

const renderedContent = computed(() => marked.parse(article.content || ''))

function onImageError(event) {
  event.target.src = '/article-img.png'
}

// ─── useMutation: 刪除文章 ───────────────────────────────────────────────────
// 刪除成功後使用 removeQueries 完全清除快取（非 invalidate）：
//   - removeQueries(['articles'])：清除首頁文章列表快取，回首頁時重新 fetch 最新資料
//   - removeQueries(['tags'])：清除標籤快取，若此文章是某標籤最後一篇，回首頁時標籤會消失
// 清除後立即 navigateTo('/')，首頁掛載時自動 fetch 最新資料。
const { mutate: deleteArticle } = useMutation({
  mutationFn: () => $fetch(`/api/articles/${route.params.id}`, { method: 'DELETE' }),
  onSuccess: () => {
    queryClient.removeQueries({ queryKey: ['articles'] })
    queryClient.removeQueries({ queryKey: ['tags'] })
    navigateTo('/')
  },
  onError: (err) => alert(err)
})

const handleDeleteArticle = () => {
  if (confirm('你確定要刪除文章嗎')) {
    deleteArticle()
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

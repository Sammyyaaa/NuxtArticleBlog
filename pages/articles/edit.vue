<template>
  <div class="flex w-full justify-center px-6 lg:px-0">
    <div class="w-full max-w-3xl justify-center">
      <form
        class="w-full space-y-8 divide-y"
        :class="{ 'divide-stone-700': isDark, 'divide-stone-200': !isDark }"
        @submit.prevent="handleSubmit"
      >
        <div class="space-y-8 divide-y divide-stone-200">
          <div>
            <div class="mt-8">
              <h3
                class="font-serif text-2xl font-normal tracking-wide"
                :class="{ 'text-stone-100': isDark, 'text-stone-800': !isDark }"
              >
                編輯文章
              </h3>
            </div>

            <div class="mt-8 flex flex-col gap-6">
              <div>
                <label
                  for="title"
                  class="block text-xs font-mono uppercase tracking-widest"
                  :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                >
                  文章標題
                </label>
                <div class="mt-2">
                  <input
                    id="title"
                    v-model="articleData.title"
                    required
                    placeholder="請輸入文章標題"
                    name="title"
                    type="text"
                    autocomplete="title"
                    class="block w-full appearance-none rounded border px-3 py-2 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    :class="{
                      'bg-stone-800 border-stone-600 text-stone-100': isDark,
                      'border-stone-300': !isDark
                    }"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-xs font-mono uppercase tracking-widest"
                  :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                >
                  文章標籤
                </label>
                <div class="mt-2 flex flex-wrap items-center gap-2 min-h-[34px]">
                  <!-- input + + 按鈕 -->
                  <div class="flex items-center gap-1">
                    <input
                      v-model="tagInput"
                      type="text"
                      placeholder="新增標籤"
                      class="w-28 rounded border px-2 py-1 text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      :class="{
                        'bg-stone-800 border-stone-600 text-stone-100': isDark,
                        'bg-white border-stone-300': !isDark
                      }"
                      @keydown="onTagKeydown"
                    />
                    <button
                      type="button"
                      class="rounded px-2 py-1 text-xs font-mono transition-colors"
                      :class="{
                        'bg-stone-600 text-stone-300 hover:bg-amber-600 hover:text-white': isDark,
                        'bg-stone-200 text-stone-600 hover:bg-amber-500 hover:text-white': !isDark
                      }"
                      @click="addTag"
                    >
                      +
                    </button>
                  </div>

                  <!-- 已選標籤標題 -->
                  <span
                    class="text-xs font-mono"
                    :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                    >套用中</span
                  >

                  <!-- 本次已選的標籤 chips -->
                  <span
                    v-for="tag in articleData.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs"
                    :class="{
                      'bg-stone-600 text-stone-300': isDark,
                      'bg-stone-200 text-stone-600': !isDark
                    }"
                  >
                    {{ tag }}
                    <button
                      type="button"
                      class="hover:text-amber-500 transition-colors"
                      @click="removeTag(tag)"
                    >
                      ×
                    </button>
                  </span>

                  <!-- 分隔線（有既有標籤才顯示） -->
                  <span
                    v-if="existingTags?.filter((t) => !articleData.tags.includes(t)).length"
                    class="self-stretch border-l mx-1"
                    :class="{ 'border-stone-600': isDark, 'border-stone-300': !isDark }"
                  />

                  <!-- 可選標籤標題 -->
                  <span
                    v-if="existingTags?.filter((t) => !articleData.tags.includes(t)).length"
                    class="text-xs font-mono"
                    :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                    >可選擇</span
                  >

                  <!-- 資料庫既有標籤（未被選的） -->
                  <button
                    v-for="tag in existingTags?.filter((t) => !articleData.tags.includes(t))"
                    :key="'ex-' + tag"
                    type="button"
                    class="rounded px-2 py-0.5 font-mono text-xs transition-colors"
                    :class="{
                      'bg-stone-600 text-stone-300 hover:bg-amber-600 hover:text-white': isDark,
                      'bg-stone-200 text-stone-600 hover:bg-amber-500 hover:text-white': !isDark
                    }"
                    @click="addExistingTag(tag)"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <div>
                <label
                  for="cover"
                  class="block text-xs font-mono uppercase tracking-widest"
                  :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                >
                  代表性圖片連結
                </label>
                <div class="mt-2">
                  <input
                    id="cover"
                    v-model="articleData.cover"
                    placeholder="請輸入網址連結"
                    name="cover"
                    type="text"
                    autocomplete="cover"
                    class="block w-full appearance-none rounded border px-3 py-2 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    :class="{
                      'bg-stone-800 border-stone-600 text-stone-100': isDark,
                      'border-stone-300': !isDark
                    }"
                  />
                </div>
              </div>

              <div>
                <label
                  for="img"
                  class="block text-xs font-mono uppercase tracking-widest"
                  :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                >
                  {{
                    uploadImgFileName
                      ? '上傳中：' + uploadImgFileName
                      : articleData.img_filename
                        ? '已上傳：' + articleData.img_filename
                        : '上傳圖片'
                  }}
                </label>
                <div class="mt-2">
                  <button
                    type="button"
                    class="block w-full appearance-none rounded border px-3 py-2 text-sm text-center transition-colors"
                    :class="{
                      'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700': isDark,
                      'border-stone-300 text-stone-600 hover:bg-stone-100': !isDark
                    }"
                    @click="handleUpload"
                  >
                    {{
                      uploadImgFileName
                        ? '變更圖片'
                        : articleData.img_filename
                          ? '變更已上傳圖片'
                          : '上傳圖片'
                    }}
                  </button>
                </div>
              </div>

              <div>
                <label
                  for="content"
                  class="block text-xs font-mono uppercase tracking-widest"
                  :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
                >
                  文章內容
                </label>
                <div class="mt-2">
                  <textarea
                    id="content"
                    v-model="articleData.content"
                    required
                    name="content"
                    rows="12"
                    placeholder="請填寫文章內容..."
                    class="block min-h-[45px] w-full appearance-none rounded border px-3 py-2 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    :class="{
                      'bg-stone-800 border-stone-600 text-stone-100': isDark,
                      'border-stone-300': !isDark
                    }"
                  />
                  <p class="mt-1.5 font-mono text-xs text-stone-400">
                    支援 Markdown 語法 # 標題 **粗體** `程式碼` - 清單
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="py-5">
          <div class="flex justify-end gap-3">
            <BlackAndWhiteButton :height="37.81" :width="61.82">
              <NuxtLink class="absolute inset-0 flex items-center justify-center" to="/">
                取消
              </NuxtLink>
            </BlackAndWhiteButton>
            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex items-center justify-center gap-2 border font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              :class="{
                'border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark':
                  isDark,
                'border-luxury-gold-dark text-luxury-gold-dark hover:bg-luxury-gold-dark hover:text-white':
                  !isDark
              }"
            >
              <svg
                v-if="isSaving"
                class="h-3.5 w-3.5 animate-spin"
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
                  stroke-width="2"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {{ isSaving ? '儲存中...' : '儲存' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useQuery, useMutation } from '@tanstack/vue-query'

const route = useRoute()
const isDark = useDark()

const articleData = reactive({
  title: '',
  content: '',
  cover: '',
  img: null,
  img_filename: '',
  tags: []
})

// ─── useQuery: 既有標籤 ──────────────────────────────────────────────────────
// queryKey: ['tags']（與 create.vue、index.vue 共用快取）
// 取得資料庫中已存在的標籤，顯示在標籤輸入框右側供快速點選。
const { data: existingTags } = useQuery({
  queryKey: ['tags'],
  queryFn: () => $fetch('/api/tags')
})

// ─── useQuery: 文章資料（供編輯表單填入） ────────────────────────────────────
// queryKey: ['article', id]（與 [id].vue 相同）
// 若使用者先瀏覽文章頁再點「編輯」，此快取已存在，直接讀取，不重打 API。
// watch({ immediate: true })：快取有值時立即同步到 articleData，
// 同時確保 tags 永遠是陣列（舊文章在 DB migration 前建立，tags 欄位可能為 null）。
const { data } = useQuery({
  queryKey: ['article', route.query.id],
  queryFn: () => $fetch(`/api/articles/${route.query.id}`)
})

watch(
  data,
  (newData) => {
    if (!newData) return
    Object.assign(articleData, newData)
    // tags 防呆：DB migration 前建立的文章，tags 欄位可能回傳 null
    if (!Array.isArray(articleData.tags)) articleData.tags = []
  },
  { immediate: true }
)

const { tagInput, addTag, addExistingTag, removeTag, onTagKeydown } = useArticleTags(articleData)
const { uploadImgFileName, handleUpload: _handleUpload } = useImageUpload(articleData)
const { invalidateArticlesAndTags, prefetchHomePageData } = useQueryCacheSync()

const handleUpload = () => _handleUpload('uploadEditInput')

// ─── useMutation: 編輯文章 ───────────────────────────────────────────────────
// 編輯成功後的快取策略（同 create.vue 邏輯，額外多清除單篇文章快取）：
//
// 1. invalidateArticlesAndTags(id)：清除首頁列表、此篇文章、標籤的快取
//
// 2. prefetchHomePageData()（非阻塞，背景執行）
//    在導頁到文章詳情頁的同時，背景預先 fetch 首頁的文章列表與標籤。
//    用戶在文章頁停留的時間 = 背景 fetch 完成的時間，
//    回首頁時資料已就緒，無載入延遲。
const { mutate: editArticle, isPending: isSaving } = useMutation({
  mutationFn: (formData) =>
    $fetch(`/api/articles/${route.query.id}`, { method: 'PATCH', body: formData }),
  onSuccess: async (response) => {
    const input = document.getElementById('uploadEditInput')
    if (input) input.remove()
    invalidateArticlesAndTags(route.query.id)
    await prefetchHomePageData()
    navigateTo({ name: 'articles-id', params: { id: response.id } })
  },
  onError: (error) => alert(error.value)
})

const handleSubmit = () => {
  const formData = new FormData()
  formData.append('title', articleData.title)
  formData.append('content', articleData.content)
  formData.append('cover', articleData.cover)
  formData.append('img_filename', uploadImgFileName.value)
  if (articleData.img) {
    formData.append('img', articleData.img)
  }
  formData.append('tags', articleData.tags.join(','))
  editArticle(formData)
}

// 進入建立文章頁面，觸發路由中間件判斷是否有登入
definePageMeta({
  middleware: 'auth'
})
</script>

<style>
textarea::-webkit-scrollbar {
  width: 5px;
}

textarea::-webkit-scrollbar-thumb {
  background-color: #56595c;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-track {
  background-color: #c5c4c4;
}
</style>

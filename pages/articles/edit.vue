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
              class="inline-flex items-center justify-center border font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 transition-all duration-200"
              :class="{
                'border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark':
                  isDark,
                'border-luxury-gold-dark text-luxury-gold-dark hover:bg-luxury-gold-dark hover:text-white':
                  !isDark
              }"
            >
              儲存
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

const route = useRoute()
const isDark = useDark()
const uploadImgFileName = ref('')
const tagInput = ref('')

// ─── useQuery: 既有標籤 ──────────────────────────────────────────────────────
// queryKey: ['tags']（與 create.vue、index.vue 共用快取）
// 取得資料庫中已存在的標籤，顯示在標籤輸入框右側供快速點選。
const { data: existingTags } = useQuery({
  queryKey: ['tags'],
  queryFn: () => $fetch('/api/tags')
})

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !articleData.tags.includes(tag)) {
    articleData.tags = [...articleData.tags, tag]
  }
  tagInput.value = ''
}

const addExistingTag = (tag) => {
  if (!articleData.tags.includes(tag)) {
    articleData.tags = [...articleData.tags, tag]
  }
}

const onTagKeydown = (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}

const removeTag = (tag) => {
  articleData.tags = articleData.tags.filter((t) => t !== tag)
}

const articleData = reactive({
  title: '',
  content: '',
  cover: '',
  img: null,
  img_filename: '',
  tags: []
})
const queryClient = useQueryClient()

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

// ─── useMutation: 編輯文章 ───────────────────────────────────────────────────
// 編輯成功後的快取策略（同 create.vue 邏輯，額外多清除單篇文章快取）：
//
// 1. removeQueries(['articles'])：清除首頁文章列表快取
// 2. removeQueries(['article', id])：清除此篇文章快取，避免文章頁顯示舊內容
// 3. removeQueries(['tags'])：清除標籤快取（標籤有異動時同步更新）
//
// 4. prefetchQuery（非阻塞，背景執行）
//    在導頁到文章詳情頁的同時，背景預先 fetch 首頁的文章列表與標籤。
//    用戶在文章頁停留的時間 = 背景 fetch 完成的時間，
//    回首頁時資料已就緒，無載入延遲。
const { mutate: editArticle } = useMutation({
  mutationFn: (formData) =>
    $fetch(`/api/articles/${route.query.id}`, { method: 'PATCH', body: formData }),
  onSuccess: (response) => {
    const input = document.getElementById('uploadEditInput')
    if (input) input.remove()
    queryClient.removeQueries({ queryKey: ['articles'] })
    queryClient.removeQueries({ queryKey: ['article', route.query.id] })
    queryClient.removeQueries({ queryKey: ['tags'] })
    // 背景預熱首頁資料：用戶在文章頁停留期間完成 fetch，回首頁即時顯示
    queryClient.prefetchQuery({
      queryKey: ['articles', { page: 1, sort: 'DESC', search: '', isSearching: false, tag: null }],
      queryFn: () => $fetch('/api/articles', { query: { page: 1, pageSize: 10, sort: 'DESC' } })
    })
    queryClient.prefetchQuery({
      queryKey: ['tags'],
      queryFn: () => $fetch('/api/tags')
    })
    navigateTo({ name: 'articles-id', params: { id: response.id } })
  },
  onError: (error) => alert(error.value)
})

const handleSubmit = () => {
  // 使用 FormData 包裝所有資料，包含上傳的圖片檔案
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

const handleUpload = () => {
  // 利用原生 JS 創造一個隱藏的 file input 元素
  const uploadInput = document.createElement('input')
  uploadInput.type = 'file'
  uploadInput.id = 'uploadEditInput'
  uploadInput.accept = 'image/*'
  uploadInput.style.display = 'none'
  document.body.appendChild(uploadInput)

  // 為 input 綁定 change 事件
  uploadInput.addEventListener('change', (event) => {
    // 若使用 TypeScript，可寫：(event.target as HTMLInputElement)
    const file = event.target.files ? event.target.files[0] : null
    if (file) {
      articleData.img = file
      uploadImgFileName.value = articleData.img.name
      // console.log('選擇的檔案：', articleData.img)
    }
  })

  // 觸發 input 的 click 事件，顯示上傳檔案對話框
  uploadInput.click()
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

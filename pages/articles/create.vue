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
                新增文章
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
                        'bg-stone-700 text-stone-300 hover:bg-amber-600 hover:text-white': isDark,
                        'bg-stone-100 text-stone-600 hover:bg-amber-500 hover:text-white': !isDark
                      }"
                      @click="addTag"
                    >
                      +
                    </button>
                  </div>

                  <!-- 本次新增的暫時標籤 chips -->
                  <span
                    v-for="tag in articleData.tags"
                    :key="tag"
                    class="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs"
                    :class="{ 'bg-stone-700 text-stone-300': isDark, 'bg-stone-100 text-stone-600': !isDark }"
                  >
                    {{ tag }}
                    <button type="button" class="hover:text-amber-500 transition-colors" @click="removeTag(tag)">×</button>
                  </span>

                  <!-- 分隔線（有既有標籤才顯示） -->
                  <span
                    v-if="existingTags?.filter(t => !articleData.tags.includes(t)).length"
                    class="self-stretch border-l mx-1"
                    :class="{ 'border-stone-600': isDark, 'border-stone-300': !isDark }"
                  />

                  <!-- 資料庫既有標籤（未被選的） -->
                  <button
                    v-for="tag in existingTags?.filter(t => !articleData.tags.includes(t))"
                    :key="'ex-' + tag"
                    type="button"
                    class="rounded px-2 py-0.5 font-mono text-xs transition-colors"
                    :class="{
                      'bg-stone-800 text-stone-400 hover:bg-amber-600 hover:text-white': isDark,
                      'bg-stone-100 text-stone-500 hover:bg-amber-500 hover:text-white': !isDark
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
                  圖片連結
                </label>
                <div class="mt-2">
                  <input
                    id="cover"
                    v-model="articleData.cover"
                    placeholder="請輸入圖片網址"
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
                  {{ uploadImgFileName ? '上傳中：' + uploadImgFileName : '上傳圖片' }}
                </label>
                <div class="mt-2">
                  <button
                    type="button"
                    class="block w-full appearance-none rounded border px-3 py-2 text-sm transition-colors"
                    :class="{
                      'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700': isDark,
                      'border-stone-300 text-stone-600 hover:bg-stone-100': !isDark
                    }"
                    @click="handleUpload"
                  >
                    {{ uploadImgFileName ? '變更圖片' : '上傳圖片' }}
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
                    支援 Markdown 語法　# 標題　**粗體**　`程式碼`　- 清單
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="py-5">
          <div class="flex justify-end gap-3">
            <BlackAndWhiteButton :height="37.81" :width="61.82">
              <NuxtLink to="/" class="absolute inset-0 flex items-center justify-center">
                取消
              </NuxtLink>
            </BlackAndWhiteButton>
            <button
              type="submit"
              class="inline-flex justify-center rounded border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              發布
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'

const uploadImgFileName = ref('')
const tagInput = ref('')

// ─── useQuery: 既有標籤 ──────────────────────────────────────────────────────
// queryKey: ['tags']
// 取得資料庫中已存在的標籤，顯示在標籤輸入框右側（| 分隔線後）供快速點選。
// 此快取與首頁共用，mutation 完成後 removeQueries 清除，首頁標籤列即時同步。
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
  tags: []
})
const isDark = useDark()
const queryClient = useQueryClient()

// ─── useMutation: 新增文章 ───────────────────────────────────────────────────
// 新增成功後的快取策略：
//
// 1. removeQueries(['articles'])、removeQueries(['tags'])
//    完全清除舊快取（非 invalidate），確保首頁下次掛載時取得最新資料。
//    使用 removeQueries 而非 invalidateQueries 的原因：
//    invalidate 會保留舊資料並背景更新，用戶回首頁時仍先看到舊內容，有延遲感。
//
// 2. prefetchQuery（非阻塞，背景執行）
//    清除快取後立即在背景開始 fetch 首頁第一頁的文章和標籤資料。
//    這個 prefetch 在用戶瀏覽文章詳情頁的時間內完成，
//    當用戶點「返回文章列表」時，資料已在快取中，首頁即時渲染，無需等待。
//
// 3. navigateTo → 文章詳情頁
//    prefetchQuery 是非同步非阻塞，不影響導頁時機。
const { mutate: createArticle } = useMutation({
  mutationFn: (formData) => $fetch('/api/articles', { method: 'POST', body: formData }),
  onSuccess: (response) => {
    const input = document.getElementById('uploadInput')
    if (input) input.remove()
    queryClient.removeQueries({ queryKey: ['articles'] })
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
  if (articleData.img) {
    formData.append('img', articleData.img)
  }
  formData.append('tags', articleData.tags.join(','))
  createArticle(formData)
}

// 進入建立文章頁面，觸發路由中間件判斷是否有登入
definePageMeta({
  middleware: 'auth'
})

const handleUpload = () => {
  // 利用原生 JS 創造一個隱藏的 file input 元素
  const uploadInput = document.createElement('input')
  uploadInput.type = 'file'
  uploadInput.id = 'uploadInput'
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

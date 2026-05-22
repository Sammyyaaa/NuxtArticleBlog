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
                    class="block w-full appearance-none rounded border px-3 py-2 text-sm transition-colors"
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
              <NuxtLink class="absolute inset-0 flex items-center justify-center" to="/">
                取消
              </NuxtLink>
            </BlackAndWhiteButton>
            <button
              type="submit"
              class="inline-flex justify-center rounded border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
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
const articleData = reactive({
  title: '',
  content: '',
  cover: '',
  img: null,
  img_filename: ''
})
const queryClient = useQueryClient()

// 來自 pages/articles/edit.vue
// 原本: await useFetch(`/api/articles/${id}`) + onMounted 同步到 articleData
// 改為: useQuery 共用 ['article', id] 快取（與 [id].vue 相同的 queryKey），若已有快取則不重複請求
const { data } = useQuery({
  queryKey: ['article', route.query.id],
  queryFn: () => $fetch(`/api/articles/${route.query.id}`)
})

watch(
  data,
  (newData) => {
    if (!newData) return
    Object.assign(articleData, newData)
  },
  { immediate: true }
)

// 來自 pages/articles/edit.vue
// 原本: await $fetch(PATCH).then(response => navigateTo(...))
// 改為: useMutation，成功後同時 invalidate 文章列表（['articles']）和該篇文章快取（['article', id]），
//       讓首頁列表和文章頁都能拿到最新資料
const { mutate: editArticle } = useMutation({
  mutationFn: (formData) =>
    $fetch(`/api/articles/${route.query.id}`, { method: 'PATCH', body: formData }),
  onSuccess: (response) => {
    // 送出成功後，移除先前動態建立的 file input
    const input = document.getElementById('uploadEditInput')
    if (input) input.remove()
    queryClient.invalidateQueries({ queryKey: ['articles'] })
    queryClient.invalidateQueries({ queryKey: ['article', route.query.id] })
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

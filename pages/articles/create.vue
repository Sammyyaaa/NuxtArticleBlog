<template>
  <div
    class="flex w-full justify-center px-6 lg:px-0 h-[calc(100vh-65.81px)]"
    :class="{ 'bg-gray-800': isDark }"
  >
    <div class="mb-8 w-full max-w-3xl justify-center">
      <form
        class="w-full space-y-8 divide-y"
        :class="{ 'divide-gray-700': isDark, 'divide-gray-200': !isDark }"
        @submit.prevent="handleSubmit"
      >
        <div class="space-y-8 divide-y divide-gray-200">
          <div>
            <div class="mt-6">
              <h3
                class="text-xl font-medium leading-6"
                :class="{ 'text-gray-300': isDark, 'text-gray-900': !isDark }"
              >
                新增文章
              </h3>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
              <div class="col-span-12">
                <label
                  for="title"
                  class="block text-sm font-medium"
                  :class="{ 'text-gray-300': isDark, 'text-gray-700': !isDark }"
                >
                  文章標題
                </label>
                <div class="mt-1">
                  <input
                    id="title"
                    v-model="articleData.title"
                    required
                    placeholder="請輸入文章標題"
                    name="title"
                    type="text"
                    autocomplete="title"
                    class="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    :class="{
                      'bg-gray-800 border-gray-600 text-white': isDark,
                      'border-gray-300': !isDark
                    }"
                  />
                </div>
              </div>
              <div class="col-span-12">
                <label
                  for="cover"
                  class="block text-sm font-medium"
                  :class="{ 'text-gray-300': isDark, 'text-gray-700': !isDark }"
                >
                  圖片連結
                </label>
                <div class="mt-1">
                  <input
                    id="cover"
                    v-model="articleData.cover"
                    placeholder="請輸入圖片網址"
                    name="cover"
                    type="text"
                    autocomplete="cover"
                    class="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    :class="{
                      'bg-gray-800 border-gray-600 text-white': isDark,
                      'border-gray-300': !isDark
                    }"
                  />
                </div>
              </div>

              <div class="col-span-12">
                <label
                  for="img"
                  class="block text-sm font-medium"
                  :class="{ 'text-gray-300': isDark, 'text-gray-700': !isDark }"
                >
                  {{ uploadImgFileName ? '圖片上傳中 : ' : '上傳圖片' }}
                  {{ uploadImgFileName ? uploadImgFileName : '' }}
                </label>
                <div class="mt-1">
                  <button
                    type="button"
                    class="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400"
                    :class="{
                      'bg-gray-800 border-gray-600 text-white hover:text-gray-700 hover:bg-gray-300':
                        isDark,
                      'border-gray-300 hover:text-white hover:bg-gray-500': !isDark
                    }"
                    @click="handleUpload"
                  >
                    {{ uploadImgFileName ? '變更上傳中圖片' : '上傳圖片' }}
                  </button>
                </div>
              </div>

              <div class="col-span-12">
                <label
                  for="content"
                  class="block text-sm font-medium"
                  :class="{ 'text-gray-300': isDark, 'text-gray-700': !isDark }"
                  >文章內容</label
                >
                <div class="mt-1">
                  <textarea
                    id="content"
                    v-model="articleData.content"
                    required
                    name="content"
                    rows="10"
                    placeholder="請填寫文章內容..."
                    class="block min-h-[45px] w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    :class="{
                      'bg-gray-800 border-gray-600 text-white': isDark,
                      'border-gray-300': !isDark
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-5">
          <div class="flex justify-end">
            <BlackAndWhiteButton :height="37.81" :width="61.82">
              <NuxtLink to="/" class="absolute inset-0 flex items-center justify-center">
                取消
              </NuxtLink>
            </BlackAndWhiteButton>
            <button
              type="submit"
              class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
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
const uploadImgFileName = ref('')
const articleData = reactive({
  title: '',
  content: '',
  cover: '',
  img: null
})
const isDark = useDark()

const handleSubmit = async () => {
  // 使用 FormData 包裝所有資料，包含上傳的圖片檔案
  const formData = new FormData()
  formData.append('title', articleData.title)
  formData.append('content', articleData.content)
  formData.append('cover', articleData.cover)
  if (articleData.img) {
    formData.append('img', articleData.img)
  }

  await $fetch('/api/articles', {
    method: 'POST',
    body: formData
  })
    .then((response) => {
      // 送出成功後，移除先前動態建立的 file input
      const input = document.getElementById('uploadInput')
      if (input) {
        input.remove()
      }

      navigateTo({
        name: 'articles-id',
        params: { id: response.id }
      })
    })
    .catch((error) => alert(error.value))
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

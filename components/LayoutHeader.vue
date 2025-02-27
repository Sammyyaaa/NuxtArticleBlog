<template>
  <!-- 水平導覽列 -->
  <header class="flex w-full justify-center">
    <nav
      class="flex w-full items-center justify-between px-6 lg:px-60 py-2 border-b-2"
      :class="{
        'bg-gray-800 border-gray-600': isDark,
        'border-gray-200': !isDark
      }"
    >
      <div>
        <NuxtLink to="/">
          <div class="flex items-center justify-between">
            <div class="flex items-center mr-3">
              <!-- nuxt-icon 元件 -->
              <Icon
                class="h-12 w-12"
                name="material-symbols:edit-note"
                :class="{ 'text-white': isDark, 'text-gray-700': !isDark }"
              />
            </div>
            <div
              class="hidden h-6 text-2xl font-semibold text-gray-700 sm:block"
              :class="{ 'text-white': isDark }"
            >
              Article Blog
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="flex flex-row">
        <!-- 亮暗主題切換按鈕 -->
        <ToggleThemeButton class="mr-3" />

        <!-- 判斷有資料時顯示 UI -->
        <div v-if="userInfo" class="group relative z-30">
          <label for="avatar" class="cursor-pointer">
            <img
              class="inline-block h-10 w-10 rounded-full bg-white/90 object-cover object-center p-0.5 shadow-md"
              :src="userInfo.avatar"
              alt="使用者選單"
            />
          </label>
          <!-- Popup UI -->
          <div class="absolute hidden right-0 w-60 pt-0.5 text-gray-700 group-hover:block">
            <div
              class="mt-1 divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
              :class="{
                'border-2 border-gray-600 divide-gray-700': isDark,
                'divide-gray-100': isDark
              }"
            >
              <div
                class="flex items-center px-4 py-3"
                :class="{ 'bg-gray-800 text-white': isDark }"
              >
                <img
                  :src="userInfo.avatar"
                  class="inline-block h-9 w-9 rounded-full bg-white/90 object-cover object-center p-0.5 shadow"
                />
                <div class="ml-3.5 flex-grow overflow-hidden">
                  <p class="overflow-hidden text-ellipsis font-medium">
                    {{ userInfo.nickname }}
                  </p>
                  <p
                    class="overflow-hidden text-ellipsis text-xs text-gray-500"
                    :class="{ 'text-white': isDark }"
                  >
                    {{ userInfo.email }}
                  </p>
                </div>
              </div>
              <div class="group/menu-item px-1 py-1" :class="{ 'bg-gray-800 text-white': isDark }">
                <NuxtLink
                  class="flex w-full items-center rounded-md px-2 py-2 text-sm"
                  :class="{
                    'group-hover/menu-item:bg-white group-hover/menu-item:text-gray-700': isDark,
                    'group-hover/menu-item:text-white group-hover/menu-item:bg-gray-700': !isDark
                  }"
                  to="/articles/create"
                >
                  <Icon
                    class="mr-2 h-5 w-5 text-emerald-400"
                    :class="{
                      'group-hover/menu-item:text-gray-700': isDark,
                      'group-hover/menu-item:text-white': !isDark
                    }"
                    name="ri:pencil-line"
                  />
                  撰寫文章
                </NuxtLink>
              </div>
              <div class="group/menu-item px-1 py-1" :class="{ 'bg-gray-800 text-white': isDark }">
                <button
                  class="flex w-full items-center rounded-md px-2 py-2 text-sm"
                  :class="{
                    'group-hover/menu-item:bg-white group-hover/menu-item:text-gray-700': isDark,
                    'group-hover/menu-item:text-white group-hover/menu-item:bg-gray-700': !isDark
                  }"
                  @click="handleLogout"
                >
                  <Icon
                    class="mr-2 h-5 w-5 text-emerald-400"
                    :class="{
                      'group-hover/menu-item:text-gray-700': isDark,
                      'group-hover/menu-item:text-white': !isDark
                    }"
                    name="ri:logout-box-line"
                  />
                  登出
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- 無資料時顯示登入按鈕 -->
        <NuxtLink
          v-else
          class="px-3 py-2 font-semibold transition hover:text-emerald-500"
          :class="{
            'text-gray-300': isDark,
            'text-gray-700': !isDark
          }"
          to="/login"
        >
          登入
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
const route = useRoute()
const { data } = await useFetch('/api/whoami')
const userInfo = useState('userInfo') // 全域共享狀態
const isDark = useDark()

watch(
  data,
  (newData) => {
    // console.log(newData)
    userInfo.value = newData
  },
  {
    immediate: true // 觸發新狀態
  }
)

const handleLogout = () => {
  $fetch('/api/session', {
    method: 'DELETE'
  }).then(() => {
    userInfo.value = null
  })

  if (route.path === '/articles/create' || route.path === '/articles/edit') {
    navigateTo('/')
  }
  // console.log(route.path)
}
</script>

<template>
  <header class="flex w-full justify-center">
    <nav
      class="flex w-full items-center justify-between px-6 lg:px-60 py-3 border-b-2 border-amber-500/60"
      :class="{
        'bg-stone-900': isDark,
        'bg-stone-50': !isDark
      }"
    >
      <!-- 品牌名 -->
      <NuxtLink to="/">
        <span
          class="font-serif text-2xl tracking-wide"
          :class="{ 'text-stone-100': isDark, 'text-stone-800': !isDark }"
        >
          Article Blog
        </span>
      </NuxtLink>

      <div class="flex flex-row items-center gap-10">
        <!-- 亮暗主題切換按鈕 -->
        <ToggleThemeButton />

        <!-- 登入狀態：顯示使用者選單 -->
        <div v-if="userInfo" class="group relative z-30">
          <label for="avatar" class="cursor-pointer">
            <img
              class="inline-block h-9 w-9 rounded-full object-cover object-center ring-2 ring-amber-500/40"
              :src="userInfo.avatar"
              alt="使用者選單"
            />
          </label>
          <!-- Popup -->
          <div class="absolute hidden right-0 w-56 pt-1 group-hover:block">
            <div
              class="divide-y rounded-md shadow-xl overflow-hidden"
              :class="{
                'bg-stone-800 divide-stone-700 ring-1 ring-stone-600': isDark,
                'bg-white divide-stone-100 ring-1 ring-stone-200': !isDark
              }"
            >
              <div
                class="flex items-center px-4 py-3"
                :class="{ 'text-stone-100': isDark, 'text-stone-700': !isDark }"
              >
                <img
                  :src="userInfo.avatar"
                  class="inline-block h-8 w-8 rounded-full object-cover object-center"
                />
                <div class="ml-3 flex-grow overflow-hidden">
                  <p class="overflow-hidden text-ellipsis text-sm font-medium">
                    {{ userInfo.nickname }}
                  </p>
                  <p class="overflow-hidden text-ellipsis text-xs text-stone-400 mt-0.5">
                    {{ userInfo.email }}
                  </p>
                </div>
              </div>
              <div
                class="group/menu-item px-1 py-1"
                :class="{ 'bg-stone-800': isDark, 'bg-white': !isDark }"
              >
                <NuxtLink
                  class="flex w-full items-center rounded px-3 py-2 text-sm transition-colors"
                  :class="{
                    'text-stone-300 hover:bg-stone-700': isDark,
                    'text-stone-600 hover:bg-stone-100': !isDark
                  }"
                  to="/articles/create"
                >
                  <Icon class="mr-2 h-4 w-4 text-amber-500" name="ri:pencil-line" />
                  撰寫文章
                </NuxtLink>
              </div>
              <div
                class="group/menu-item px-1 py-1"
                :class="{ 'bg-stone-800': isDark, 'bg-white': !isDark }"
              >
                <button
                  class="flex w-full items-center rounded px-3 py-2 text-sm transition-colors"
                  :class="{
                    'text-stone-300 hover:bg-stone-700': isDark,
                    'text-stone-600 hover:bg-stone-100': !isDark
                  }"
                  @click="handleLogout"
                >
                  <Icon class="mr-2 h-4 w-4 text-amber-500" name="ri:logout-box-line" />
                  登出
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 未登入：顯示登入連結 -->
        <NuxtLink
          v-else
          class="text-sm font-medium transition-colors hover:text-amber-500"
          :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
          to="/login"
        >
          登入
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

// 來自 components/LayoutHeader.vue
// 原本: await useFetch('/api/whoami') + useState('userInfo') + watch 同步到全域狀態
// 改為: useQuery 管理，queryKey: ['whoami'] 讓其他元件（如 pages/articles/[id].vue）可共用快取，不重複請求
const { data: userInfo } = useQuery({
  queryKey: ['whoami'],
  queryFn: () => $fetch('/api/whoami')
})

const route = useRoute()
const isDark = useDark()
const queryClient = useQueryClient()

// 來自 components/LayoutHeader.vue
// 原本: $fetch('/api/session', DELETE).then(() => userInfo.value = null)
// 改為: useMutation，成功後 invalidateQueries(['whoami']) 讓 userInfo 自動清空並觸發重新整理
const { mutate: logout } = useMutation({
  mutationFn: () => $fetch('/api/session', { method: 'DELETE' }),
  onSuccess: () => {
    queryClient.setQueryData(['whoami'], null)
    if (route.path === '/articles/create' || route.path === '/articles/edit') {
      navigateTo('/')
    }
  }
})

const handleLogout = () => logout()
</script>

<template>
  <header class="w-full relative z-50">
    <!-- 頂部金色光暈線 -->
    <div class="h-px w-full bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />

    <!-- 主標題列 -->
    <div
      class="flex items-center px-6 lg:px-20 py-5"
      :class="{
        'bg-luxury-dark/88 backdrop-blur-sm': isDark,
        'bg-luxury-light-bg/92 backdrop-blur-sm': !isDark
      }"
    >
      <!-- 左裝飾線（僅桌面顯示） -->
      <div
        class="hidden md:block flex-1 h-px transition-colors"
        :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
      />

      <!-- 品牌名 -->
      <NuxtLink to="/" class="md:px-8 group shrink-0">
        <span
          class="font-serif text-xl lg:text-2xl tracking-[0.3em] uppercase transition-colors duration-300"
          :class="{
            'text-luxury-cream group-hover:text-luxury-gold': isDark,
            'text-luxury-light-text group-hover:text-luxury-gold-dark': !isDark
          }"
        >
          Article Blog
        </span>
      </NuxtLink>

      <!-- 彈性間隔（行動版：把控制列推到右側；桌面：隱藏） -->
      <div class="flex-1 md:hidden" />

      <!-- 右側：裝飾線 + 控制列 -->
      <div class="md:flex-1 flex items-center">
        <!-- 右裝飾線（僅桌面顯示） -->
        <div
          class="hidden md:block flex-1 h-px transition-colors"
          :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
        />
        <!-- 控制列 -->
        <div class="md:pl-8 shrink-0 flex items-center gap-4 md:gap-6">
          <!-- 亮暗主題切換按鈕 -->
          <ToggleThemeButton />

          <!-- 登入狀態：顯示使用者選單（hover 觸發） -->
          <div
            v-if="userInfo"
            class="relative"
            @mouseenter="onAvatarMouseEnter"
            @mouseleave="onAvatarMouseLeave"
          >
            <img
              class="inline-block h-8 w-8 rounded-full object-cover object-center ring-1 cursor-pointer transition-all duration-300"
              :class="{
                'ring-luxury-gold/40 hover:ring-luxury-gold': isDark,
                'ring-luxury-gold/30 hover:ring-luxury-gold-dark': !isDark
              }"
              :src="userInfo.avatar"
              alt="使用者選單"
              @click.stop="toggleMenu"
            />
            <!-- 箭頭提示：展開時旋轉向上 -->
            <svg
              class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 transition-transform duration-300 pointer-events-none"
              :class="{
                'text-luxury-gold/70': isDark,
                'text-luxury-gold-dark/60': !isDark,
                'rotate-180': showMenu
              }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>

            <!-- 下拉選單 -->
            <Transition name="menu">
              <div v-if="showMenu" class="absolute right-0 top-full pt-2 w-72 z-50" @click.stop>
                <div
                  class="rounded overflow-hidden shadow-2xl border"
                  :class="{
                    'bg-luxury-dark-card/95 backdrop-blur-md border-luxury-warm-border': isDark,
                    'bg-white/95 backdrop-blur-md border-luxury-light-border': !isDark
                  }"
                >
                  <!-- 使用者資訊 -->
                  <div
                    class="flex items-center px-4 py-4 border-b"
                    :class="{
                      'border-luxury-warm-border': isDark,
                      'border-luxury-light-border': !isDark
                    }"
                  >
                    <img
                      :src="userInfo.avatar"
                      class="inline-block h-10 w-10 rounded-full object-cover object-center"
                    />
                    <div class="ml-3 flex-grow overflow-hidden">
                      <p
                        class="overflow-hidden text-ellipsis text-base font-medium"
                        :class="{ 'text-luxury-cream': isDark, 'text-luxury-light-text': !isDark }"
                      >
                        {{ userInfo.nickname }}
                      </p>
                      <p class="text-sm text-luxury-warm-gray mt-0.5 break-all">
                        {{ userInfo.email }}
                      </p>
                    </div>
                  </div>

                  <!-- 撰寫文章 -->
                  <div class="px-1 py-1">
                    <NuxtLink
                      class="flex w-full items-center rounded px-3 py-2 text-xs font-mono tracking-wider uppercase transition-colors"
                      :class="{
                        'text-luxury-warm-gray hover:text-luxury-gold hover:bg-luxury-warm-border/40':
                          isDark,
                        'text-luxury-light-muted hover:text-luxury-gold-dark hover:bg-luxury-light-card':
                          !isDark
                      }"
                      to="/articles/create"
                      @click="showMenu = false"
                    >
                      <svg
                        class="mr-2 h-3.5 w-3.5 text-luxury-gold"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      撰寫文章
                    </NuxtLink>
                  </div>

                  <!-- 登出 -->
                  <div class="px-1 py-1">
                    <button
                      class="flex w-full items-center rounded px-3 py-2 text-xs font-mono tracking-wider uppercase transition-colors"
                      :class="{
                        'text-luxury-warm-gray hover:text-luxury-gold hover:bg-luxury-warm-border/40':
                          isDark,
                        'text-luxury-light-muted hover:text-luxury-gold-dark hover:bg-luxury-light-card':
                          !isDark
                      }"
                      @click="handleLogout"
                    >
                      <svg
                        class="mr-2 h-3.5 w-3.5 text-luxury-gold"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      登出
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 未登入：顯示登入連結 -->
          <NuxtLink
            v-else
            class="font-mono text-xs uppercase tracking-[0.15em] transition-colors"
            :class="{
              'text-luxury-warm-gray hover:text-luxury-gold': isDark,
              'text-luxury-light-muted hover:text-luxury-gold-dark': !isDark
            }"
            to="/login"
          >
            登入
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 底部邊框線 -->
    <div
      class="h-px w-full transition-colors"
      :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
    />
  </header>
</template>

<script setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

// ─── useQuery: 登入使用者資訊 ───────────────────────────────────────────────
const { data: userInfo } = useQuery({
  queryKey: ['whoami'],
  queryFn: () => $fetch('/api/whoami')
})

const route = useRoute()
const isDark = useDark()
const queryClient = useQueryClient()
const showMenu = ref(false)
const isTouchDevice = ref(false)

const closeMenuOutside = () => {
  showMenu.value = false
}
const onAvatarMouseEnter = () => {
  if (!isTouchDevice.value) showMenu.value = true
}
const onAvatarMouseLeave = () => {
  if (!isTouchDevice.value) showMenu.value = false
}
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  document.addEventListener('click', closeMenuOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOutside)
})

// ─── useMutation: 登出 ───────────────────────────────────────────────────────
const { mutate: logout } = useMutation({
  mutationFn: () => $fetch('/api/session', { method: 'DELETE' }),
  onSuccess: () => {
    queryClient.setQueryData(['whoami'], null)
    showMenu.value = false
    if (route.path === '/articles/create' || route.path === '/articles/edit') {
      navigateTo('/')
    }
  }
})

const handleLogout = () => logout()
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

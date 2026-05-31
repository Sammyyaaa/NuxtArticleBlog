<template>
  <div
    class="relative flex flex-col items-center justify-center px-4 h-screen overflow-hidden"
    :class="{ 'bg-luxury-dark': isDark, 'bg-luxury-light-bg': !isDark }"
  >
    <!-- 粒子背景 -->
    <NuxtParticles
      :key="isDarkKey"
      id="login-particles"
      :options="particlesOptions"
      class="absolute inset-0 -z-10"
    />

    <!-- 中央登入卡片 -->
    <div
      class="relative w-full max-w-sm border rounded-sm overflow-hidden"
      :class="{
        'bg-luxury-dark-card/80 backdrop-blur-md border-luxury-warm-border': isDark,
        'bg-white/85 backdrop-blur-md border-luxury-light-border': !isDark
      }"
    >
      <!-- 頂部金色線 -->
      <div class="h-px w-full bg-gradient-to-r from-transparent via-luxury-gold/60 to-transparent" />

      <div class="px-8 py-10">
        <!-- 品牌 -->
        <div class="mb-10 text-center">
          <NuxtLink to="/">
            <span
              class="font-serif text-3xl tracking-[0.25em] uppercase transition-colors"
              :class="{
                'text-luxury-cream hover:text-luxury-gold': isDark,
                'text-luxury-light-text hover:text-luxury-gold-dark': !isDark
              }"
            >
              Article Blog
            </span>
          </NuxtLink>
          <div class="mt-4 flex items-center justify-center gap-3">
            <div class="w-8 h-px" :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }" />
            <span class="text-luxury-gold/50 text-xs">✦</span>
            <div class="w-8 h-px" :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }" />
          </div>
          <p class="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-luxury-warm-gray">
            Sign In
          </p>
        </div>

        <!-- 表單 -->
        <form class="space-y-7" @submit.prevent="handleLogin">
          <!-- 帳號 -->
          <div>
            <label
              for="account"
              class="block font-mono text-xs uppercase tracking-[0.15em] mb-2"
              :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }"
            >
              帳號
            </label>
            <input
              id="account"
              v-model="loginData.account"
              name="account"
              type="text"
              autocomplete="account"
              required
              class="block w-full bg-transparent border-b py-2 text-sm placeholder-luxury-warm-gray/40 focus:outline-none transition-colors"
              :class="{
                'border-luxury-warm-border text-luxury-cream focus:border-luxury-gold': isDark,
                'border-luxury-light-border text-luxury-light-text focus:border-luxury-gold-dark': !isDark
              }"
            />
          </div>

          <!-- 密碼 -->
          <div>
            <label
              for="password"
              class="block font-mono text-xs uppercase tracking-[0.15em] mb-2"
              :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }"
            >
              密碼
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="loginData.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="block w-full bg-transparent border-b py-2 pr-10 text-sm placeholder-luxury-warm-gray/40 focus:outline-none transition-colors"
                :class="{
                  'border-luxury-warm-gray/45 text-luxury-cream focus:border-luxury-gold': isDark,
                  'border-luxury-light-border text-luxury-light-text focus:border-luxury-gold-dark': !isDark
                }"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-1 transition-colors"
                :class="{
                  'text-luxury-warm-gray/60 hover:text-luxury-gold': isDark,
                  'text-luxury-light-muted/60 hover:text-luxury-gold-dark': !isDark
                }"
                @click="togglePassword"
              >
                <Icon v-if="showPassword" name="heroicons-outline:eye" class="h-4 w-4" />
                <Icon v-else name="heroicons-outline:eye-off" class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- 登入按鈕 -->
          <button
            type="submit"
            class="w-full border py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300"
            :class="{
              'border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark': isDark,
              'border-luxury-gold-dark text-luxury-gold-dark hover:bg-luxury-gold-dark hover:text-white': !isDark
            }"
          >
            登入
          </button>
        </form>
      </div>

      <!-- 底部金色線 -->
      <div class="h-px w-full bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent" />
    </div>
  </div>
</template>

<script setup>
import { useQueryClient } from '@tanstack/vue-query'

definePageMeta({
  layout: false
})

const isDark = useDark()
const isDarkKey = computed(() => (isDark.value ? 'dark-login' : 'light-login'))
const queryClient = useQueryClient()
const showPassword = ref(false)

const loginData = reactive({
  account: 'accountUser',
  password: '1234567'
})

// 登入頁粒子設定（與 default layout 一致）
const particlesOptions = computed(() => ({
  fullScreen: {
    enable: true,
    zIndex: -1
  },
  background: {
    color: {
      value: isDark.value ? '#080705' : '#faf8f4'
    }
  },
  particles: {
    color: { value: '#c9a84c' },
    opacity: { value: isDark.value ? 0.45 : 0.2 },
    links: {
      color: '#c9a84c',
      enable: true,
      distance: 160,
      opacity: isDark.value ? 0.18 : 0.08
    },
    move: { enable: true, speed: 0.7 },
    number: { value: 35 },
    size: { value: { min: 1, max: 3 } }
  },
  interactivity: {
    events: { onHover: { enable: true, mode: ['grab', 'bubble'] } },
    modes: {
      grab: { distance: 180, links: { opacity: 0.5 } },
      bubble: { distance: 160, size: 7, duration: 0.4, opacity: 0.9 }
    }
  },
  detectRetina: true
}))

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  const { data } = await useFetch('/api/login', {
    method: 'POST',
    body: {
      account: loginData.account,
      password: loginData.password
    }
  })

  if (data.value) {
    // 清除 whoami 快取，讓 Header 重新 fetch 取得登入後的使用者資料
    queryClient.removeQueries({ queryKey: ['whoami'] })
    navigateTo('/')
  } else {
    alert('登入失敗')
  }
}
</script>

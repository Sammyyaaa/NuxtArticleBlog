<template>
  <div
    class="flex flex-col items-center justify-center px-4 h-screen border-t-4 border-amber-500"
    :class="{ 'bg-stone-900': isDark, 'bg-stone-50': !isDark }"
  >
    <div class="w-full max-w-sm">

      <!-- 品牌 -->
      <div class="mb-10 text-center">
        <NuxtLink to="/">
          <span
            class="font-serif text-3xl tracking-wide"
            :class="{ 'text-stone-100': isDark, 'text-stone-800': !isDark }"
          >
            Article Blog
          </span>
        </NuxtLink>
        <p class="mt-3 font-mono text-xs uppercase tracking-widest text-stone-400">Sign In</p>
      </div>

      <!-- 表單 -->
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label
            for="account"
            class="block font-mono text-xs uppercase tracking-widest"
            :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
          >
            帳號
          </label>
          <div class="mt-2">
            <input
              id="account"
              v-model="loginData.account"
              name="account"
              type="text"
              autocomplete="account"
              required
              class="block w-full rounded border px-3 py-2 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              :class="{
                'bg-stone-800 border-stone-600 text-stone-100': isDark,
                'bg-white border-stone-300': !isDark
              }"
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block font-mono text-xs uppercase tracking-widest"
            :class="{ 'text-stone-400': isDark, 'text-stone-500': !isDark }"
          >
            密碼
          </label>
          <div class="mt-2 relative">
            <input
              id="password"
              v-model="loginData.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="block w-full rounded border px-3 py-2 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              :class="{
                'bg-stone-800 border-stone-600 text-stone-100': isDark,
                'bg-white border-stone-300': !isDark
              }"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center px-3 transition-colors"
              :class="{ 'text-stone-400 hover:text-stone-200': isDark, 'text-stone-400 hover:text-stone-600': !isDark }"
              @click="togglePassword"
            >
              <Icon v-if="showPassword" name="heroicons-outline:eye" class="h-4 w-4" />
              <Icon v-else name="heroicons-outline:eye-off" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          class="w-full rounded border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          登入
        </button>
      </form>

      <!-- 底部分隔線 -->
      <div class="mt-10 flex items-center gap-4">
        <div class="h-px flex-1" :class="{ 'bg-stone-700': isDark, 'bg-stone-200': !isDark }" />
        <span class="text-amber-500">✦</span>
        <div class="h-px flex-1" :class="{ 'bg-stone-700': isDark, 'bg-stone-200': !isDark }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQueryClient } from '@tanstack/vue-query'

definePageMeta({
  layout: false
})

const isDark = useDark()
const queryClient = useQueryClient()
const showPassword = ref(false)

const loginData = reactive({
  account: 'accountUser',
  password: '1234567'
})

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

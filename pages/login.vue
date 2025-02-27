<template>
  <!-- 登入頁面 -->
  <div
    class="flex flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8 h-[100vh]"
    :class="{ 'bg-gray-800': isDark }"
  >
    <div class="w-full max-w-md">
      <div class="flex flex-col items-center">
        <NuxtLink to="/">
          <div class="flex items-center justify-between">
            <div class="mr-3">
              <!-- nuxt-icon 元件 -->
              <Icon
                size="70"
                name="material-symbols:edit-note"
                :class="{ 'text-white': isDark, 'text-gray-700': !isDark }"
              />
            </div>
            <div
              class="hidden h-6 text-3xl font-semibold text-gray-700 sm:block"
              :class="{ 'text-white': isDark }"
            >
              Article Blog
            </div>
          </div>
        </NuxtLink>
        <h2
          class="mt-6 text-center text-2xl font-bold tracking-tight"
          :class="{ 'text-gray-200': isDark, 'text-gray-900': !isDark }"
        >
          登入帳號
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="px-4 py-8 shadow-md sm:rounded-lg sm:px-10"
          :class="{ 'bg-gray-700': isDark, 'bg-white': !isDark }"
        >
          <form class="space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="account"
                class="block text-sm font-medium"
                :class="{ 'text-gray-300': isDark, 'text-gray-700': !isDark }"
              >
                帳號
              </label>
              <div class="mt-1">
                <input
                  id="account"
                  v-model="loginData.account"
                  name="account"
                  type="text"
                  autocomplete="account"
                  required
                  class="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  :class="{
                    'bg-gray-800 border-gray-600 text-white': isDark,
                    'border-gray-300': !isDark
                  }"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium"
                :class="{ 'text-gray-300': isDark, 'text-gray-700': !isDark }"
              >
                密碼
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="loginData.password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  required
                  class="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  :class="{
                    'bg-gray-800 border-gray-600 text-white': isDark,
                    'border-gray-300': !isDark
                  }"
                />
                <!-- 眼睛圖示 -->
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-3"
                  :class="{
                    'text-gray-300 hover:text-gray-500': isDark,
                    'text-gray-500 hover:text-gray-700': !isDark
                  }"
                  @click="togglePassword"
                >
                  <Icon v-if="showPassword" name="heroicons-outline:eye" class="h-5 w-5" />
                  <Icon v-else name="heroicons-outline:eye-off" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 text-white"
              >
                登入
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false // 登入頁面不顯示 Header
})

const loginData = reactive({
  account: 'accountUser',
  password: '1234567'
})
const loginError = () => {
  alert('登入失敗')
}
const isDark = useState('isDark')

const showPassword = ref(false) // 控制密碼顯示與隱藏

// 切換密碼顯示狀態
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
    navigateTo('/')
  } else {
    loginError()
  }
}
</script>

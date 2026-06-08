// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', 'nuxt-particles'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    adminAccount: process.env.ADMIN_ACCOUNT,
    adminPassword: process.env.ADMIN_PASSWORD
  },
  icon: {
    serverBundle: {
      collections: ['ri', 'heroicons', 'heroicons-outline', 'eos-icons']
    }
  }
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}', // 掃描 components 資料夾中的所有 Vue, JS, 和 TS 文件
    './layouts/**/*.vue', // 掃描 layouts 資料夾中的所有 Vue 文件
    './pages/**/*.vue', // 掃描 pages 資料夾中的所有 Vue 文件
    './composables/**/*.{js,ts}', // 掃描 composables 資料夾中的所有 JS 和 TS 文件
    './plugins/**/*.{js,ts}', // 掃描 plugins 資料夾中的所有 JS 和 TS 文件
    './utils/**/*.{js,ts}', // 掃描 utils 資料夾中的所有 JS 和 TS 文件
    './{App,app}.{js,ts,vue}', // 匹配根目錄中的 App 或 app 文件（支持 JS、TS 和 Vue）
    './{Error,error}.{js,ts,vue}', // 匹配根目錄中的 Error 或 error 文件（支持 JS、TS 和 Vue）
    './app.config.{js,ts}' // 匹配根目錄中的 app.config.js 或 app.config.ts 文件
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        serif: [
          "'Playfair Display'",
          'Georgia',
          'Cambria',
          "'Times New Roman'",
          'ui-serif',
          'serif'
        ],
        body: ["'Cormorant Garamond'", 'Georgia', 'Cambria', 'serif'],
        mono: ['ui-monospace', 'Cascadia Code', 'Source Code Pro', 'Menlo', 'Consolas', 'monospace']
      },
      colors: {
        luxury: {
          gold: '#c9a84c',
          'gold-light': '#e8d5a3',
          'gold-dark': '#9a7228',
          cream: '#f2ead8',
          'cream-muted': '#d4c9b2',
          dark: '#080705',
          'dark-2': '#100e0b',
          'dark-3': '#1a1610',
          'dark-card': '#12100d',
          'warm-gray': '#b8a890',
          'warm-border': '#2a2318',
          'light-bg': '#faf8f4',
          'light-card': '#f5f1ea',
          'light-border': '#e2d9c8',
          'light-text': '#1a1410',
          'light-muted': '#7a6a58'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

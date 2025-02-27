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
    extend: {} // 自定義主題擴展點（目前為空）
  },
  plugins: [] // 插件列表（目前為空）
}

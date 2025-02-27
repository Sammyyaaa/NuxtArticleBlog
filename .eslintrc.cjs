module.exports = {
  env: {
    browser: true, // 啟用瀏覽器環境變數（如 window, document）
    es2023: true // 支持 ECMAScript 2023 的語法特性
  },
  extends: ['@nuxtjs', 'prettier'], // 繼承 Nuxt.js 的 ESLint 配置
  parserOptions: {
    ecmaVersion: 2023, // 設定解析器的 ECMAScript 語法版本
    sourceType: 'module' // 支持 ES 模組（import/export）
  },
  plugins: ['prettier'], // 插件
  rules: {
    'no-undef': 'off', // 關閉未定義變數的檢查
    // 'prettier/prettier': 'error' // 啟用 Prettier 的錯誤提示檢查
    'prettier/prettier': ['error', { endOfLine: 'auto' }] // 啟用 Prettier 的錯誤提示檢查
  }
}

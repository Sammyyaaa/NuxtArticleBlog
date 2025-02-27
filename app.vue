<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// SEO 優化 - 網頁標題對於搜尋引擎的爬蟲是重要資訊
useHead({
  // 顯示瀏覽器網頁標題，在這個網頁中都具有這個標籤
  title: 'Article Blog | Home',
  titleTemplate: (title) => (title ? `${title}` : 'Article Blog'),

  // 在 titleTemplate 所傳入的物件中添加其他 HTML 選項
  htmlAttrs: {
    lang: 'zh-TW' // 設定 HTML 標籤的語言屬性，這樣瀏覽器和搜尋引擎會知道此網站的語言是繁體中文 (台灣)
  },
  link: {
    rel: 'icon', // 設定網站的 Favicon (網站圖示)
    href: '/Edit-Note.ico' // 指定 Favicon 圖片的路徑，通常放在 `public` 資料夾中
  }
})

// 設定以上的 SEO 相關 meta 標籤
useSeoMeta({
  description: '歡迎來到使用 Article Blog 部落格網站',
  ogTitle: 'Article Blog',
  ogDescription: '歡迎來到使用 Article Blog 部落格網站',
  ogUrl: 'http://localhost:3000/',
  ogImage: 'https://i.imgur.com/AVNujNC.png'
})
</script>

<style>
/* Chrome, Safari, Edge 等使用 WebKit 引擎的瀏覽器 */
::-webkit-scrollbar {
  width: 8px; /* 調整滾動條寬度 */
}

::-webkit-scrollbar-track {
  background: #c7c7c7; /* 軌道背景色 */
}

::-webkit-scrollbar-thumb {
  background-color: #464646; /* 滾動條顏色 */
  border-radius: 6px; /* 滾動條圓角 */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #363636; /* 懸停狀態顏色 */
}
</style>

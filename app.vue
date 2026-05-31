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
  title: 'Article Blog | Home',
  titleTemplate: (title) => (title ? `${title}` : 'Article Blog'),
  htmlAttrs: {
    lang: 'zh-TW'
  },
  link: [
    { rel: 'icon', href: '/Edit-Note.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ]
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

body {
  font-family: 'Cormorant Garamond', Georgia, Cambria, serif;
}

/* 金色漸層細滾動條 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #1a1610;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #c9a84c, #9a7228);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #c9a84c;
}

/* 金色選取效果 */
::selection {
  background: rgba(201, 168, 76, 0.25);
  color: #f2ead8;
}
</style>

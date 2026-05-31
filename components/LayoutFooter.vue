<template>
  <footer
    class="py-8 px-6 lg:px-20"
    :class="{
      'bg-luxury-dark/88 backdrop-blur-sm': isDark,
      'bg-luxury-light-bg/92 backdrop-blur-sm': !isDark
    }"
  >
    <!-- 裝飾分隔線 -->
    <div class="mb-6 flex items-center gap-4">
      <div
        class="flex-1 h-px"
        :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
      />
      <span class="text-luxury-gold/70 text-xs">✦</span>
      <div
        class="flex-1 h-px"
        :class="{ 'bg-luxury-warm-border': isDark, 'bg-luxury-light-border': !isDark }"
      />
    </div>

    <div class="text-center space-y-1.5">
      <p
        class="font-serif text-sm tracking-[0.25em] uppercase"
        :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }"
      >
        Article Blog
      </p>
      <p
        class="font-mono text-xs tracking-widest"
        :class="{ 'text-luxury-warm-gray/40': isDark, 'text-luxury-light-muted/50': !isDark }"
      >
        Copyright &copy; 2025 SamYen &mdash; All Rights Reserved
      </p>
    </div>
  </footer>
</template>

<script setup>
const isDark = useDark()
</script>

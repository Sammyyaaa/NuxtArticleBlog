<template>
  <Transition name="top-btn">
    <button
      v-show="showScroll"
      class="fixed right-6 flex flex-col items-center gap-1 group focus:outline-none"
      :style="{ bottom: bottomOffset + 'px' }"
      @click="scrollToTop"
    >
      <!-- 上箭頭 -->
      <svg
        class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
        :class="{
          'text-luxury-gold/60 group-hover:text-luxury-gold': isDark,
          'text-luxury-gold-dark/50 group-hover:text-luxury-gold-dark': !isDark
        }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
      <!-- TOP 文字 -->
      <span
        class="font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300"
        :class="{
          'text-luxury-warm-gray group-hover:text-luxury-gold': isDark,
          'text-luxury-light-muted group-hover:text-luxury-gold-dark': !isDark
        }"
      >
        Top
      </span>
    </button>
  </Transition>
</template>

<script setup>
const isDark = useDark()
const showScroll = ref(false)
const bottomOffset = ref(24)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScroll.value = window.scrollY > 50

  const footer = document.querySelector('footer')
  if (footer) {
    const footerTop = footer.getBoundingClientRect().top
    const viewportHeight = window.innerHeight
    if (footerTop < viewportHeight) {
      bottomOffset.value = viewportHeight - footerTop + 4
    } else {
      bottomOffset.value = 24
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.top-btn-enter-active,
.top-btn-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.top-btn-enter-from,
.top-btn-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

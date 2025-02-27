<template>
  <button
    v-show="showScroll"
    class="fixed bottom-4 right-4 py-2 px-4 rounded-lg shadow-md transition duration-300 opacity-80"
    :class="{
      'border border-gray-700 bg-gray-800 hover:bg-gray-700 text-white': isDark,
      'border border-gray-300 bg-gray-200 hover:bg-gray-300 text--gray-200': !isDark
    }"
    @click="scrollToTop"
  >
    Top
  </button>
</template>

<script setup>
const isDark = useDark()
const showScroll = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScroll.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

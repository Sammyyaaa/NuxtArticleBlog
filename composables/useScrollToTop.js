export const useScrollToTop = () => {
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

  onMounted(() => window.addEventListener('scroll', handleScroll))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))

  return { showScroll, bottomOffset, scrollToTop }
}

export const useMenuToggle = () => {
  const showMenu = ref(false)

  const closeMenuOutside = () => {
    showMenu.value = false
  }

  const toggleMenu = () => {
    showMenu.value = !showMenu.value
  }

  onMounted(() => document.addEventListener('click', closeMenuOutside))
  onUnmounted(() => document.removeEventListener('click', closeMenuOutside))

  return { showMenu, toggleMenu }
}

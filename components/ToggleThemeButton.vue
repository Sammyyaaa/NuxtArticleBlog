<template>
  <button
    class="group p-2 flex rounded focus:outline-none"
    :class="{
      'hover:bg-gray-200': isDark,
      'dark:hover:bg-gray-700': !isDark
    }"
    @click="toggleTheme"
  >
    <Icon v-if="isDark" name="ri:sun-line" class="h-6 w-6 text-white group-hover:text-gray-700" />
    <Icon v-else name="ri:moon-line" class="h-6 w-6 group-hover:text-white" />
  </button>
</template>

<script setup>
const isDark = useState('isDark')
function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

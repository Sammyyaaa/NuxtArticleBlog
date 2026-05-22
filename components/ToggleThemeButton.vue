<template>
  <button class="group flex focus:outline-none" @click="toggleTheme">
    <Icon
      v-if="isDark"
      name="ri:sun-line"
      class="h-6 w-6 text-stone-400 transition-colors group-hover:text-amber-400"
    />
    <Icon
      v-else
      name="ri:moon-line"
      class="h-6 w-6 text-stone-400 transition-colors group-hover:text-amber-500"
    />
  </button>
</template>

<script setup>
const isDark = useDark()
function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

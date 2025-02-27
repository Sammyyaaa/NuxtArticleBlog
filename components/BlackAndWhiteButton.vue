<template>
  <button
    type="button"
    class="relative rounded-md border px-4 py-2 text-sm font-medium"
    :class="{
      'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-400 hover:text-gray-800': isDark,
      'bg-white text-gray-500 border-gray-300 hover:bg-gray-500 hover:text-gray-200': !isDark
    }"
    :style="{ width: props.width + 'px', height: props.height + 'px' }"
  >
    <slot />
  </button>
</template>

<script setup>
const isDark = useDark()
const props = defineProps({
  height: {
    type: Number,
    default: 35
  },
  width: {
    type: Number,
    default: 62
  }
})
</script>

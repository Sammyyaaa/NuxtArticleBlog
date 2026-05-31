<template>
  <button
    type="button"
    class="relative border font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 transition-colors duration-200"
    :class="{
      'border-luxury-warm-gray/55 text-luxury-warm-gray hover:border-luxury-gold hover:text-luxury-gold': isDark,
      'border-stone-400 text-stone-600 hover:border-luxury-gold-dark hover:text-luxury-gold-dark': !isDark
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

<template>
  <footer
    class="py-6 px-6 lg:px-60 border-t"
    :class="{
      'bg-stone-900 border-stone-700': isDark,
      'bg-stone-100 border-stone-200': !isDark
    }"
  >
    <div class="container mx-auto px-4 flex items-center justify-center">
      <p class="font-mono text-xs text-gray-500 flex flex-col sm:flex-row sm:gap-1">
        <span>Copyright &copy; 2025 SamYen.</span>
        <span>All Rights Reserved.</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
const isDark = useDark()
</script>

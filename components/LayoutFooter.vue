<template>
  <footer class="py-8 px-6 lg:px-60" :class="{ 'bg-gray-900': isDark, 'bg-gray-50': !isDark }">
    <div class="container mx-auto px-4 flex items-center justify-center">
      <p class="text-sm text-gray-500 flex flex-col sm:flex-row">
        Copyright &copy; 2025 SamYen. <span>All Rights Reserved.</span>
      </p>
    </div>
  </footer>
</template>

<script setup>
const isDark = useState('isDark', () => true)
</script>

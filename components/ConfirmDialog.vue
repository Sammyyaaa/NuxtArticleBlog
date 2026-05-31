<template>
  <Transition name="dialog">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[200] flex items-center justify-center px-4"
      @click.self="$emit('cancel')"
    >
      <!-- 背景遮罩 -->
      <div
        class="absolute inset-0 backdrop-blur-sm"
        :class="{ 'bg-black/60': isDark, 'bg-black/30': !isDark }"
      />

      <!-- 對話框 -->
      <div
        class="relative w-full max-w-sm rounded border shadow-2xl"
        :class="{
          'bg-luxury-dark-card border-luxury-warm-border': isDark,
          'bg-white border-luxury-light-border': !isDark
        }"
      >
        <!-- 頂部金色裝飾線 -->
        <div class="h-px w-full bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />

        <div class="px-6 py-6">
          <!-- 標題 -->
          <p
            class="font-serif text-base tracking-wide"
            :class="{ 'text-luxury-cream': isDark, 'text-luxury-light-text': !isDark }"
          >
            {{ title }}
          </p>

          <!-- 說明文字 -->
          <p
            v-if="message"
            class="mt-2 font-mono text-xs"
            :class="{ 'text-luxury-warm-gray': isDark, 'text-luxury-light-muted': !isDark }"
          >
            {{ message }}
          </p>

          <!-- 按鈕列 -->
          <div class="mt-6 flex justify-end gap-3">
            <!-- 取消 -->
            <button
              type="button"
              class="border font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 transition-colors duration-200"
              :class="{
                'border-luxury-warm-gray/55 text-luxury-warm-gray hover:border-luxury-gold hover:text-luxury-gold': isDark,
                'border-stone-400 text-stone-600 hover:border-luxury-gold-dark hover:text-luxury-gold-dark': !isDark
              }"
              @click="$emit('cancel')"
            >
              取消
            </button>

            <!-- 確定 -->
            <button
              type="button"
              class="border font-mono text-xs uppercase tracking-[0.12em] px-4 py-2 transition-colors duration-200"
              :class="{
                'border-rose-500/70 text-rose-400 hover:bg-rose-500 hover:text-white': isDark,
                'border-rose-400 text-rose-500 hover:bg-rose-500 hover:text-white': !isDark
              }"
              @click="$emit('confirm')"
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const isDark = useDark()

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '確定要執行此操作嗎？'
  },
  message: {
    type: String,
    default: ''
  }
})

defineEmits(['confirm', 'cancel', 'update:modelValue'])
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-active .relative,
.dialog-leave-active .relative {
  transition: transform 0.2s ease;
}
.dialog-enter-from .relative,
.dialog-leave-to .relative {
  transform: scale(0.95);
}
</style>

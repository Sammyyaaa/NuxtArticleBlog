<template>
  <div>
    <!-- 已加入的標籤 chips -->
    <div v-if="modelValue.length" class="flex flex-wrap gap-2 mb-2">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs"
        :class="{
          'bg-stone-700 text-stone-300': isDark,
          'bg-stone-100 text-stone-600': !isDark
        }"
      >
        {{ tag }}
        <button type="button" class="hover:text-amber-500 transition-colors" @click="remove(tag)">
          ×
        </button>
      </span>
    </div>

    <!-- 輸入新標籤 -->
    <input
      v-model="input"
      type="text"
      placeholder="輸入標籤後按 Enter 或逗號新增"
      class="block w-full rounded border px-3 py-2 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
      :class="{
        'bg-stone-800 border-stone-600 text-stone-100': isDark,
        'bg-white border-stone-300': !isDark
      }"
      @keydown="onKeydown"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue'])
const isDark = useDark()
const input = ref('')

const onKeydown = (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    add()
  }
}

const add = () => {
  const tag = input.value.replace(',', '').trim()
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
  input.value = ''
}

const remove = (tag) => {
  emit('update:modelValue', props.modelValue.filter((t) => t !== tag))
}
</script>

<template>
  <!-- 布局模板 -->
  <div class="relative min-h-screen flex flex-col">
    <LayoutHeader />
    <!-- 內容包一個 relative 容器（或設定 z-index）確保內容在上層 -->
    <div class="relative z-10 flex-1">
      <slot />
    </div>
    <!-- 粒子背景：絕對定位覆蓋整個容器，且 z-index 為 -10 -->
    <NuxtParticles
      :key="isDarkKey"
      id="tsparticles"
      :options="options"
      class="absolute inset-0 -z-10"
    />
    <LayoutFooter />
  </div>
</template>

<script setup>
const isDark = useDark()
const isDarkKey = computed(() => (isDark.value ? 'dark' : 'light'))
const options = computed(() => ({
  fullScreen: {
    enable: true,
    zIndex: -1
  },
  background: {
    color: {
      value: isDark.value ? '#1c1917' : '#fafaf9'
    }
  },
  particles: {
    color: {
      value: isDark.value ? '#78716c' : '#e7e5e4'
    },
    links: {
      color: isDark.value ? '#78716c' : '#e7e5e4',
      enable: true,
      distance: 175
    },
    move: {
      enable: true
    },
    number: {
      value: 40
    },
    size: {
      value: { min: 1, max: 5 }
    }
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'bubble'
      }
    },
    modes: {
      bubble: {
        distance: 250,
        size: 18,
        duration: 2,
        opacity: 0.1
      }
    }
  },
  // 在螢幕寬度小於 768px
  responsive: [
    {
      maxWidth: 768,
      options: {
        particles: {
          links: {
            distance: 120
          },
          number: {
            value: 15
          },
          size: {
            value: { min: 1, max: 5 }
          }
        }
      }
    }
  ],
  detectRetina: true
}))
</script>

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
      id="tsparticles"
      :key="isDarkKey"
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
      value: isDark.value ? '#080705' : '#faf8f4'
    }
  },
  particles: {
    color: {
      value: '#c9a84c'
    },
    opacity: {
      value: isDark.value ? 0.45 : 0.55
    },
    links: {
      color: '#c9a84c',
      enable: true,
      distance: 160,
      opacity: isDark.value ? 0.18 : 0.35
    },
    move: {
      enable: true,
      speed: 0.7
    },
    number: {
      value: 40
    },
    size: {
      value: { min: 1, max: 3 }
    }
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: ['grab', 'bubble']
      }
    },
    modes: {
      grab: {
        distance: 180,
        links: {
          opacity: 0.55
        }
      },
      bubble: {
        distance: 160,
        size: 7,
        duration: 0.4,
        opacity: 0.9
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
            value: 20
          }
        }
      }
    }
  ],
  detectRetina: true
}))
</script>

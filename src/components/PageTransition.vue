<script setup>
defineProps({
  name: {
    type: String,
    default: "page",
  },
  mode: {
    type: String,
    default: "out-in",
  },
});
</script>

<template>
  <transition :name="name" :mode="mode" appear>
    <slot></slot>
  </transition>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s ease-out,
    transform 0.2s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 滑动过渡 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 缩放过渡 */
.zoom-enter-active,
.zoom-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

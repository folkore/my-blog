<script setup>
import { useScrollToTop } from "../composables/useScrollToTop";
import { ref, onMounted, onUnmounted, computed } from "vue";

// 返回顶部逻辑
const { showScrollTop, scrollToTop } = useScrollToTop();

// 阅读进度（0-100）
const progress = ref(0);

// 计算页面滚动百分比
const calculateProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  progress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
};

onMounted(() => {
  calculateProgress();
  window.addEventListener("scroll", calculateProgress, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", calculateProgress);
});

// 圆环参数
const BUTTON_SIZE = 56; // 按钮总尺寸
const STROKE_WIDTH = 5; // 圆环粗细
// 半径 = 按钮一半 - (描边宽度/2) - 内边距
const radius = BUTTON_SIZE / 2 - STROKE_WIDTH / 2 - 2;
const CENTER = BUTTON_SIZE / 2; // SVG 中心坐标
const circumference = 2 * Math.PI * radius;
const dashOffset = computed(
  () => circumference - (progress.value / 100) * circumference
);
</script>

<template>
  <transition name="fade">
    <button
      v-show="showScrollTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="返回顶部"
    >
      <!-- 圆环进度 -->
      <svg class="progress-ring" :width="BUTTON_SIZE" :height="BUTTON_SIZE">
        <!-- 背景圆 -->
        <circle
          class="ring-bg"
          :r="radius"
          :cx="CENTER"
          :cy="CENTER"
          fill="transparent"
          stroke="rgba(0,0,0,0.1)"
          :stroke-width="STROKE_WIDTH"
        />
        <!-- 进度圆 -->
        <circle
          class="ring-progress"
          :r="radius"
          :cx="CENTER"
          :cy="CENTER"
          fill="transparent"
          stroke="var(--primary-color, #3385ff)"
          :stroke-width="STROKE_WIDTH"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          :transform="`rotate(-90 ${CENTER} ${CENTER})`"
        />
      </svg>

      <!-- 箭头图标 -->
      <svg
        class="arrow-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--card-bg);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  z-index: 99;
  border: none;
  padding: 0;
  transition: transform 0.3s ease, background-color 0.3s ease;
  position: fixed;
}

.back-to-top:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: #fff;
}

/* 进度圆定位在按钮内部 */
.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.arrow-icon {
  position: relative;
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.ring-progress {
  transition: stroke 0.3s;
}

.back-to-top:hover .ring-progress {
  stroke: #fff;
}
</style>

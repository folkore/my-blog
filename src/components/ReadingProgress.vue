<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
  target: {
    type: String,
    default: "body",
  },
  height: {
    type: String,
    default: "3px",
  },
  position: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
  },
  showPercentage: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: "modern",
    validator: (value) =>
      ["modern", "minimal", "glass", "glow"].includes(value),
  },
  throttleTime: {
    type: Number,
    default: 16,
  },
});

const progress = ref(0);
const showTooltip = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });
let rafId = null;
let lastUpdate = 0;

const calculateProgress = () => {
  const now = Date.now();
  if (now - lastUpdate < props.throttleTime) {
    rafId = requestAnimationFrame(calculateProgress);
    return;
  }

  const targetElement = document.querySelector(props.target);
  if (!targetElement) {
    console.warn(`Target element "${props.target}" not found`);
    return;
  }

  const scrollTop = window.scrollY;
  const scrollHeight = targetElement.scrollHeight - window.innerHeight;

  // 确保进度值在0-100之间
  progress.value = Math.min(
    100,
    Math.max(0, scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
  );

  lastUpdate = now;
  rafId = requestAnimationFrame(calculateProgress);
};

const handleMouseMove = (event) => {
  if (!props.showPercentage) return;
  showTooltip.value = true;
  tooltipPosition.value = {
    x: event.clientX,
    y: event.clientY,
  };
};

const handleMouseLeave = () => {
  showTooltip.value = false;
};

// 新增：点击进度条跳转阅读位置
const handleClick = (event) => {
  const track = event.currentTarget;
  if (!track) return;

  const rect = track.getBoundingClientRect();
  // 计算点击位置所占比例（0-1）
  let ratio = 0;
  if (props.position === "left" || props.position === "right") {
    ratio = (event.clientY - rect.top) / rect.height;
  } else {
    ratio = (event.clientX - rect.left) / rect.width;
  }
  ratio = Math.min(Math.max(ratio, 0), 1);

  const targetElement = document.querySelector(props.target);
  if (!targetElement) return;

  const scrollHeight = targetElement.scrollHeight - window.innerHeight;
  const targetScroll = scrollHeight * ratio;

  window.scrollTo({ top: targetScroll, behavior: "smooth" });
};

onMounted(async () => {
  await nextTick();
  calculateProgress();
});

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
  }
});
</script>

<template>
  <div
    class="reading-progress"
    :class="[position, theme]"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="progress-track"
      @click="handleClick"
      :style="{
        height: position === 'left' || position === 'right' ? '100%' : height,
        width: position === 'left' || position === 'right' ? height : '100%',
      }"
    >
      <div
        class="progress-bar"
        :style="{
          [position === 'left' || position === 'right' ? 'height' : 'width']:
            `${progress}%`,
        }"
      >
        <div class="progress-glow"></div>
      </div>
    </div>

    <!-- 百分比提示 -->
    <div
      v-if="showPercentage && showTooltip"
      class="progress-tooltip"
      :style="{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y - 30}px`,
      }"
    >
      {{ Math.round(progress) }}%
    </div>
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  /* 使用可配置的层级，确保不会高于模态对话框 */
  z-index: var(--z-progress, 500);
  pointer-events: none;
  isolation: isolate;
}

.progress-track {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-full, 9999px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  /* 允许点击 */
  pointer-events: auto;
  cursor: pointer;
}

.progress-bar {
  height: 100%;
  position: relative;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modern主题 - 新设计的默认主题 */
.modern .progress-track {
  background: rgba(var(--color-primary-rgb, 51, 133, 255), 0.08);
}

.modern .progress-bar {
  background: linear-gradient(
    90deg,
    var(--color-primary, #3385ff) 0%,
    var(--color-accent, #00d4ff) 40%,
    var(--color-accent, #00d4ff) 60%,
    var(--color-primary, #3385ff) 100%
  );
  background-size: 300% 100%;
  animation: shine 4s ease-in-out infinite;
  box-shadow:
    0 0 8px rgba(var(--color-primary-rgb, 51, 133, 255), 0.25),
    0 0 16px rgba(var(--color-accent-rgb, 0, 212, 255), 0.2);
}

.modern .progress-bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: shimmer 2.5s infinite;
}

/* Minimal主题 - 简约设计 */
.minimal .progress-track {
  background: rgba(var(--color-primary-rgb, 51, 133, 255), 0.1);
}

.minimal .progress-bar {
  background: var(--color-primary, #3385ff);
  opacity: 0.7;
}

/* Glass主题 - 毛玻璃效果 */
.glass .progress-track {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(var(--blur-sm, 4px));
  -webkit-backdrop-filter: blur(var(--blur-sm, 4px));
}

.glass .progress-bar {
  background: rgba(var(--color-primary-rgb, 51, 133, 255), 0.3);
  backdrop-filter: blur(var(--blur-md, 8px));
  -webkit-backdrop-filter: blur(var(--blur-md, 8px));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glow主题 - 发光效果 */
.glow .progress-track {
  background: transparent;
}

.glow .progress-bar {
  background: linear-gradient(
    90deg,
    rgba(var(--color-primary-rgb, 51, 133, 255), 0.9),
    rgba(var(--color-accent-rgb, 0, 212, 255), 1),
    rgba(var(--color-primary-rgb, 51, 133, 255), 0.9)
  );
  box-shadow:
    0 0 10px rgba(var(--color-primary-rgb, 51, 133, 255), 0.5),
    0 0 20px rgba(var(--color-accent-rgb, 0, 212, 255), 0.3),
    0 0 30px rgba(var(--color-primary-rgb, 51, 133, 255), 0.2);
  animation: pulse 2s ease-in-out infinite;
}

/* 位置样式 */
.top {
  /* 与导航栏底部无缝贴合 */
  top: var(--nav-height, 4rem);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
}

.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
}

.left {
  top: 0;
  left: 0;
  height: 100vh;
  margin: 0;
}

.right {
  top: 0;
  right: 0;
  height: 100vh;
  margin: 0;
}

/* 提示框样式 */
.progress-tooltip {
  position: fixed;
  background: var(--color-glass-background, rgba(255, 255, 255, 0.95));
  color: var(--color-text, #1e293b);
  padding: 6px 12px;
  border-radius: var(--radius-md, 8px);
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  transform: translateX(-50%);
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(var(--blur-sm, 4px));
  -webkit-backdrop-filter: blur(var(--blur-sm, 4px));
  z-index: var(--z-tooltip, 600);
  letter-spacing: 0.5px;
}

/* 动画效果 */
@keyframes shine {
  0% {
    background-position: 100% 0;
  }
  50% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* 暗色主题适配 */
:root[data-theme="dark"] {
  .progress-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .progress-tooltip {
    background: var(--color-glass-background-dark, rgba(0, 0, 0, 0.85));
    color: var(--color-text, #f8fafc);
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.2),
      0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .glass .progress-bar {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.05);
  }

  .minimal .progress-bar {
    opacity: 0.6;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .progress-tooltip {
    display: none;
  }

  .left,
  .right {
    width: 2px; /* 在移动端减小宽度 */
  }

  .top,
  .bottom {
    height: 2px; /* 在移动端减小高度 */
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  },
  title: {
    type: String,
    default: ''
  },
  autoHide: {
    type: Boolean,
    default: true
  },
  autoHideDelay: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['continue-reading', 'close'])

const isVisible = ref(true)
const isAnimating = ref(false)
let autoHideTimer = null

// 继续阅读
const handleContinueReading = () => {
  isAnimating.value = true
  emit('continue-reading')
  
  // 延迟关闭，让用户看到滚动效果
  setTimeout(() => {
    handleClose()
  }, 800)
}

// 关闭提示
const handleClose = () => {
  isVisible.value = false
  emit('close')
}

// 设置自动隐藏
const setupAutoHide = () => {
  if (props.autoHide && props.autoHideDelay > 0) {
    autoHideTimer = setTimeout(() => {
      handleClose()
    }, props.autoHideDelay)
  }
}

// 清除自动隐藏定时器
const clearAutoHide = () => {
  if (autoHideTimer) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }
}

// 鼠标悬停时暂停自动隐藏
const handleMouseEnter = () => {
  clearAutoHide()
}

// 鼠标离开时重新开始自动隐藏
const handleMouseLeave = () => {
  setupAutoHide()
}

onMounted(() => {
  setupAutoHide()
})

onUnmounted(() => {
  clearAutoHide()
})
</script>

<template>
  <Transition
    name="slide-up"
    appear
  >
    <div
      v-if="isVisible"
      class="reading-progress-notification"
      :class="{ 'is-animating': isAnimating }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="notification-content">
        <div class="notification-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        
        <div class="notification-text">
          <div class="notification-title">继续阅读</div>
          <div class="notification-subtitle">
            {{ title ? `《${title}》` : '上次阅读' }} · {{ Math.round(progress) }}%
          </div>
        </div>
        
        <div class="notification-progress">
          <div class="progress-circle">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="var(--color-border)"
                stroke-width="2"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="var(--color-primary)"
                stroke-width="2"
                stroke-linecap="round"
                :stroke-dasharray="`${2 * Math.PI * 14}`"
                :stroke-dashoffset="`${2 * Math.PI * 14 * (1 - progress / 100)}`"
                transform="rotate(-90 16 16)"
                class="progress-stroke"
              />
            </svg>
            <span class="progress-text">{{ Math.round(progress) }}%</span>
          </div>
        </div>
      </div>
      
      <div class="notification-actions">
        <button
          class="btn-continue"
          @click="handleContinueReading"
          :disabled="isAnimating"
        >
          <span v-if="!isAnimating">继续阅读</span>
          <span v-else class="loading-text">
            <svg
              class="loading-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            跳转中...
          </span>
        </button>
        
        <button
          class="btn-close"
          @click="handleClose"
          :disabled="isAnimating"
          aria-label="关闭提示"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.reading-progress-notification {
  position: fixed;
  top: calc(var(--nav-height, 4rem) + 1rem);
  right: 1rem;
  z-index: var(--z-toast, 400);
  
  background: var(--color-card-background, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-xl, 0.75rem);
  box-shadow: var(--shadow-lg);
  
  max-width: 320px;
  padding: 1rem;
  
  backdrop-filter: blur(var(--blur-md, 8px));
  -webkit-backdrop-filter: blur(var(--blur-md, 8px));
  
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.notification-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-lg);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.25;
}

.notification-subtitle {
  font-size: 0.75rem;
  color: var(--color-secondary-text);
  line-height: 1.25;
  margin-top: 0.125rem;
  
  /* 文本截断 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-progress {
  flex-shrink: 0;
}

.progress-circle {
  position: relative;
  width: 32px;
  height: 32px;
}

.progress-stroke {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-continue {
  flex: 1;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}

.btn-continue:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.btn-continue:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

.btn-close {
  padding: 0.5rem;
  background: transparent;
  color: var(--color-secondary-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover:not(:disabled) {
  background: var(--color-secondary-background);
  color: var(--color-text);
}

.btn-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 动画效果 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s var(--bezier-smooth);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 暗色主题适配 */
.dark-theme .reading-progress-notification {
  background: var(--color-card-background);
  border-color: var(--color-border);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .reading-progress-notification {
    top: calc(var(--nav-height, 4rem) + 0.5rem);
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
  
  .notification-subtitle {
    font-size: 0.6875rem;
  }
  
  .btn-continue {
    font-size: 0.8125rem;
    padding: 0.4375rem 0.875rem;
  }
}

@media (max-width: 480px) {
  .reading-progress-notification {
    padding: 0.875rem;
  }
  
  .notification-content {
    gap: 0.625rem;
    margin-bottom: 0.625rem;
  }
  
  .notification-icon {
    width: 2.25rem;
    height: 2.25rem;
  }
  
  .progress-circle {
    width: 28px;
    height: 28px;
  }
  
  .progress-text {
    font-size: 0.5625rem;
  }
}
</style>

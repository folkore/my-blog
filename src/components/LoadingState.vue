<script setup>
import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '加载中...'
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  type: {
    type: String,
    default: 'spinner', // spinner, dots, pulse
    validator: (value) => ['spinner', 'dots', 'pulse'].includes(value)
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const sizeClasses = computed(() => {
  const sizes = {
    small: 'loading-small',
    medium: 'loading-medium',
    large: 'loading-large'
  }
  return sizes[props.size]
})

const typeClasses = computed(() => {
  const types = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    pulse: 'loading-pulse'
  }
  return types[props.type]
})
</script>

<template>
  <div 
    v-if="loading" 
    :class="[
      'loading-state',
      sizeClasses,
      typeClasses,
      { 'loading-inline': inline }
    ]"
  >
    <!-- 旋转加载器 -->
    <div v-if="type === 'spinner'" class="spinner">
      <div class="spinner-circle"></div>
    </div>
    
    <!-- 点状加载器 -->
    <div v-else-if="type === 'dots'" class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    
    <!-- 脉冲加载器 -->
    <div v-else-if="type === 'pulse'" class="pulse">
      <div class="pulse-circle"></div>
    </div>
    
    <span v-if="message" class="loading-message">{{ message }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  color: var(--color-secondary-text);
}

.loading-inline {
  display: inline-flex;
  padding: 0.5rem;
}

/* 尺寸变体 */
.loading-small {
  font-size: 0.85rem;
  gap: 0.5rem;
  padding: 0.5rem;
}

.loading-medium {
  font-size: 0.9rem;
  gap: 0.75rem;
  padding: 1rem;
}

.loading-large {
  font-size: 1rem;
  gap: 1rem;
  padding: 1.5rem;
}

/* 旋转加载器 */
.spinner {
  position: relative;
}

.spinner-circle {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-small .spinner-circle {
  width: 16px;
  height: 16px;
  border-width: 1.5px;
}

.loading-large .spinner-circle {
  width: 24px;
  height: 24px;
  border-width: 2.5px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 点状加载器 */
.dots {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: dot-bounce 1.4s ease-in-out infinite both;
}

.loading-small .dot {
  width: 4px;
  height: 4px;
}

.loading-large .dot {
  width: 8px;
  height: 8px;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 脉冲加载器 */
.pulse {
  position: relative;
}

.pulse-circle {
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-small .pulse-circle {
  width: 16px;
  height: 16px;
}

.loading-large .pulse-circle {
  width: 24px;
  height: 24px;
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.loading-message {
  font-weight: 500;
  white-space: nowrap;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .loading-state {
    color: var(--color-text-secondary);
  }
}

/* 减少动画效果（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .spinner-circle,
  .dot,
  .pulse-circle {
    animation: none;
  }
  
  .spinner-circle {
    border-top-color: var(--color-primary);
    opacity: 0.7;
  }
  
  .dot {
    opacity: 0.7;
  }
  
  .pulse-circle {
    opacity: 0.7;
  }
}
</style>

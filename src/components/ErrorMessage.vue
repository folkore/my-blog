<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: [String, Error, Object],
    default: null
  },
  type: {
    type: String,
    default: 'error', // error, warning, info
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  showRetry: {
    type: Boolean,
    default: false
  },
  retryText: {
    type: String,
    default: '重试'
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['dismiss', 'retry'])

const errorMessage = computed(() => {
  if (!props.error) return ''
  
  if (typeof props.error === 'string') {
    return props.error
  }
  
  if (props.error instanceof Error) {
    return props.error.message
  }
  
  if (props.error.message) {
    return props.error.message
  }
  
  return '发生了未知错误'
})

const errorIcon = computed(() => {
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[props.type]
})

const typeClasses = computed(() => {
  const classes = {
    error: 'error-message--error',
    warning: 'error-message--warning',
    info: 'error-message--info'
  }
  return classes[props.type]
})

const handleDismiss = () => {
  emit('dismiss')
}

const handleRetry = () => {
  emit('retry')
}
</script>

<template>
  <div 
    v-if="error" 
    :class="[
      'error-message',
      typeClasses,
      { 'error-message--compact': compact }
    ]"
  >
    <div class="error-content">
      <div class="error-icon">{{ errorIcon }}</div>
      <div class="error-text">
        <p class="error-main">{{ errorMessage }}</p>
        <slot name="details"></slot>
      </div>
    </div>
    
    <div v-if="showRetry || dismissible" class="error-actions">
      <button 
        v-if="showRetry"
        @click="handleRetry"
        class="error-btn error-btn--retry"
        type="button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        {{ retryText }}
      </button>
      
      <button 
        v-if="dismissible"
        @click="handleDismiss"
        class="error-btn error-btn--dismiss"
        type="button"
        :aria-label="'关闭错误提示'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid;
  font-size: 0.9rem;
  line-height: 1.5;
  animation: slideIn 0.3s ease-out;
}

.error-message--compact {
  padding: 0.75rem;
  font-size: 0.85rem;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.error-icon {
  flex-shrink: 0;
  font-size: 1.1em;
  line-height: 1;
}

.error-text {
  flex: 1;
  min-width: 0;
}

.error-main {
  margin: 0;
  word-wrap: break-word;
}

.error-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.error-btn:hover {
  transform: translateY(-1px);
}

.error-btn:active {
  transform: translateY(0);
}

/* 错误类型样式 */
.error-message--error {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.error-message--error .error-btn--retry {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.error-message--error .error-btn--retry:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

.error-message--error .error-btn--dismiss {
  color: #dc2626;
  border-color: rgba(239, 68, 68, 0.3);
}

.error-message--error .error-btn--dismiss:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.4);
}

/* 警告类型样式 */
.error-message--warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

.error-message--warning .error-btn--retry {
  background: #d97706;
  color: white;
  border-color: #d97706;
}

.error-message--warning .error-btn--retry:hover {
  background: #b45309;
  border-color: #b45309;
}

.error-message--warning .error-btn--dismiss {
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.3);
}

.error-message--warning .error-btn--dismiss:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.4);
}

/* 信息类型样式 */
.error-message--info {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

.error-message--info .error-btn--retry {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.error-message--info .error-btn--retry:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.error-message--info .error-btn--dismiss {
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.3);
}

.error-message--info .error-btn--dismiss:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.4);
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-message {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .error-actions {
    align-self: stretch;
    justify-content: flex-end;
  }
}

/* 减少动画效果（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .error-message {
    animation: none;
  }
  
  .error-btn:hover {
    transform: none;
  }
  
  .error-btn:active {
    transform: none;
  }
}
</style>

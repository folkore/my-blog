<script setup>
import { computed } from 'vue'
import { useReadingPreferences } from '../composables/useReadingPreferences'

const props = defineProps({
  articleSlug: {
    type: String,
    required: true
  },
  articleData: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.title === 'string'
    }
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'floating'].includes(value)
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['bookmark-added', 'bookmark-removed'])

const { isBookmarked, toggleBookmark } = useReadingPreferences()

// 计算是否已收藏
const bookmarked = computed(() => isBookmarked(props.articleSlug))

// 切换收藏状态
const handleToggleBookmark = async () => {
  try {
    const success = toggleBookmark(props.articleSlug, props.articleData)
    
    if (success) {
      if (bookmarked.value) {
        emit('bookmark-removed', props.articleSlug)
      } else {
        emit('bookmark-added', props.articleSlug, props.articleData)
      }
    }
  } catch (error) {
    console.error('Failed to toggle bookmark:', error)
  }
}

// 计算按钮文本
const buttonText = computed(() => {
  if (!props.showLabel) return ''
  return bookmarked.value ? '已收藏' : '收藏'
})

// 计算按钮标题
const buttonTitle = computed(() => {
  return bookmarked.value ? '取消收藏' : '收藏文章'
})
</script>

<template>
  <button
    class="bookmark-button"
    :class="[
      `size-${size}`,
      `variant-${variant}`,
      { 
        bookmarked,
        'with-label': showLabel
      }
    ]"
    @click="handleToggleBookmark"
    :title="buttonTitle"
    :aria-label="buttonTitle"
  >
    <!-- 收藏图标 -->
    <div class="bookmark-icon">
      <!-- 未收藏状态 -->
      <svg
        v-if="!bookmarked"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon-outline"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      
      <!-- 已收藏状态 -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon-filled"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </div>
    
    <!-- 文本标签 -->
    <span v-if="showLabel" class="bookmark-label">
      {{ buttonText }}
    </span>
    
    <!-- 动画效果 -->
    <div class="bookmark-ripple" :class="{ active: bookmarked }"></div>
  </button>
</template>

<style scoped>
.bookmark-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  background: transparent;
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-lg, 0.5rem);
  color: var(--color-secondary-text, #475569);
  cursor: pointer;
  
  font-family: inherit;
  font-weight: 500;
  
  transition: all var(--transition-normal) var(--bezier-smooth);
  overflow: hidden;
  
  /* 防止选中文本 */
  user-select: none;
  -webkit-user-select: none;
}

.bookmark-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.05);
  transform: translateY(-1px);
}

.bookmark-button:active {
  transform: translateY(0);
}

/* 已收藏状态 */
.bookmark-button.bookmarked {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
}

.bookmark-button.bookmarked:hover {
  border-color: var(--color-error, #ef4444);
  color: var(--color-error, #ef4444);
  background: rgba(239, 68, 68, 0.05);
}

/* 图标样式 */
.bookmark-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-outline,
.icon-filled {
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.icon-filled {
  animation: bookmark-fill 0.3s var(--bezier-bounce);
}

/* 尺寸变体 */
.size-small {
  padding: 0.375rem;
  font-size: 0.75rem;
}

.size-small .bookmark-icon {
  width: 1rem;
  height: 1rem;
}

.size-medium {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.size-medium .bookmark-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.size-large {
  padding: 0.75rem;
  font-size: 1rem;
}

.size-large .bookmark-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* 带标签的按钮 */
.with-label.size-small {
  padding: 0.375rem 0.75rem;
}

.with-label.size-medium {
  padding: 0.5rem 1rem;
}

.with-label.size-large {
  padding: 0.75rem 1.25rem;
}

/* 样式变体 */
.variant-minimal {
  border: none;
  background: transparent;
  border-radius: var(--radius-full, 9999px);
}

.variant-minimal:hover {
  background: var(--color-secondary-background, #f8fafc);
}

.variant-floating {
  border: none;
  background: var(--color-card-background, #ffffff);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-full, 9999px);
  
  backdrop-filter: blur(var(--blur-md, 8px));
  -webkit-backdrop-filter: blur(var(--blur-md, 8px));
}

.variant-floating:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

.variant-floating.bookmarked {
  background: var(--color-primary);
  color: white;
}

/* 波纹效果 */
.bookmark-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  pointer-events: none;
}

.bookmark-ripple.active {
  width: 100px;
  height: 100px;
  opacity: 0;
}

/* 动画效果 */
@keyframes bookmark-fill {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 暗色主题适配 */
.dark-theme .bookmark-button {
  border-color: var(--color-border);
  color: var(--color-secondary-text);
}

.dark-theme .bookmark-button:hover {
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
}

.dark-theme .variant-floating {
  background: var(--color-card-background);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bookmark-button {
    /* 在移动端增大触摸区域 */
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
  
  .size-small {
    padding: 0.5rem;
  }
  
  .size-medium {
    padding: 0.625rem;
  }
  
  .size-large {
    padding: 0.75rem;
  }
  
  .with-label.size-small {
    padding: 0.5rem 0.875rem;
  }
  
  .with-label.size-medium {
    padding: 0.625rem 1rem;
  }
  
  .with-label.size-large {
    padding: 0.75rem 1.25rem;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .bookmark-button,
  .bookmark-icon,
  .icon-outline,
  .icon-filled,
  .bookmark-ripple {
    transition: none;
    animation: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .bookmark-button {
    border-width: 2px;
  }
  
  .bookmark-button:hover,
  .bookmark-button.bookmarked {
    border-width: 2px;
  }
}
</style>

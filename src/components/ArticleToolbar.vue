<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import FontSettingsPanel from "./FontSettingsPanel.vue";

// 定义props
const props = defineProps({
  articleTitle: {
    type: String,
    default: ""
  },
  readTime: {
    type: String,
    default: ""
  }
});

// 工具栏状态
const isVisible = ref(true);
const isSticky = ref(false);
const toolbarRef = ref(null);

// 滚动处理
let lastScrollY = 0;
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  
  // 判断是否应该显示工具栏
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // 向下滚动且超过100px，隐藏工具栏
    isVisible.value = false;
  } else {
    // 向上滚动或在顶部，显示工具栏
    isVisible.value = true;
  }
  
  // 判断是否应该固定工具栏
  isSticky.value = currentScrollY > 200;
  
  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div 
    ref="toolbarRef"
    class="article-toolbar"
    :class="{ 
      'toolbar-sticky': isSticky,
      'toolbar-hidden': !isVisible
    }"
  >
    <div class="toolbar-container">
      <!-- 左侧：文章信息 -->
      <div class="toolbar-left">
        <div class="article-info">
          <h3 class="article-title" :title="articleTitle">{{ articleTitle }}</h3>
          <span class="read-time" v-if="readTime">{{ readTime }}</span>
        </div>
      </div>

      <!-- 右侧：工具按钮 -->
      <div class="toolbar-right">
        <!-- 字体设置面板 -->
        <FontSettingsPanel />
        
        <!-- 分享按钮 -->
        <button 
          class="toolbar-btn share-btn"
          @click="shareArticle"
          title="分享文章"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>

        <!-- 打印按钮 -->
        <button 
          class="toolbar-btn print-btn"
          @click="printArticle"
          title="打印文章"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6,9 6,2 18,2 18,9"/>
            <path d="M6,18H4a2,2 0 0,1-2-2v-5a2,2 0 0,1,2-2H20a2,2 0 0,1,2,2v5a2,2 0 0,1-2,2H18"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    shareArticle() {
      if (navigator.share) {
        navigator.share({
          title: this.articleTitle,
          url: window.location.href
        });
      } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href);
        // 这里可以添加提示消息
      }
    },
    
    printArticle() {
      window.print();
    }
  }
}
</script>

<style scoped>
.article-toolbar {
  position: relative;
  width: 100%;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition-normal);
  z-index: 50;
}

.toolbar-sticky {
  position: fixed;
  top: var(--nav-height, 72px);
  left: 0;
  right: 0;
  background: var(--color-glass-background);
  backdrop-filter: blur(var(--blur-lg));
  -webkit-backdrop-filter: blur(var(--blur-lg));
  box-shadow: var(--shadow-sm);
  z-index: 90;
}

.toolbar-hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.toolbar-container {
  max-width: var(--container-max-width, 1200px);
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.toolbar-left {
  flex: 1;
  min-width: 0;
}

.article-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.article-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.read-time {
  font-size: 0.75rem;
  color: var(--color-secondary-text);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--radius-lg);
  background: var(--color-tertiary-background);
  border: 1px solid var(--color-border);
  color: var(--color-secondary-text);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: inherit;
  font-weight: inherit;
}

.toolbar-btn:hover {
  color: var(--color-text);
  background: var(--color-secondary-background);
  border-color: var(--color-border);
}

/* 深色主题适配 */
.dark-theme .article-toolbar {
  background: var(--color-background);
  border-color: var(--color-border);
}

.dark-theme .toolbar-sticky {
  background: var(--color-glass-background-dark);
}

.dark-theme .toolbar-btn {
  background: var(--color-tertiary-background);
  border-color: var(--color-border);
  color: var(--color-secondary-text);
}

.dark-theme .toolbar-btn:hover {
  background: var(--color-secondary-background);
  color: var(--color-text);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toolbar-container {
    padding: 0.5rem 1rem;
  }
  
  .article-title {
    font-size: 0.8125rem;
    max-width: 200px;
  }
  
  .read-time {
    font-size: 0.6875rem;
  }
  
  .toolbar-btn {
    width: 32px;
    height: 32px;
  }
  
  .toolbar-btn svg {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 480px) {
  .toolbar-container {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }
  
  .article-title {
    max-width: 150px;
  }
  
  .toolbar-right {
    gap: 0.25rem;
  }
}
</style>

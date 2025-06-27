<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  allTags: {
    type: Array,
    default: () => [],
  },
  selectedTags: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["search", "tag-select"]);

const { t } = useI18n();
const searchQuery = ref("");
const isExpanded = ref(false);
const isTagPanelOpen = ref(false);

// 切换面板展开状态
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
  if (!isExpanded.value) {
    isTagPanelOpen.value = false;
  }
};

// 切换标签面板
const toggleTagPanel = () => {
  isTagPanelOpen.value = !isTagPanelOpen.value;
};

// 处理搜索
const handleSearch = () => {
  emit("search", searchQuery.value);
};

// 处理标签选择
const toggleTag = (tag) => {
  const newTags = props.selectedTags.includes(tag)
    ? props.selectedTags.filter((t) => t !== tag)
    : [...props.selectedTags, tag];

  emit("tag-select", newTags);
};

// 清除所有标签
const clearAllTags = () => {
  emit("tag-select", []);
};

// 清除搜索
const clearSearch = () => {
  searchQuery.value = "";
  emit("search", "");
};

// 计算选中标签数量
const selectedTagsCount = computed(() => props.selectedTags.length);

// 计算搜索状态
const hasActiveFilters = computed(
  () => searchQuery.value.trim() || props.selectedTags.length > 0
);
</script>

<template>
  <div class="star-search-panel" :class="{ 'is-expanded': isExpanded }">
    <!-- 主搜索按钮 -->
    <button
      class="search-trigger"
      @click="toggleExpanded"
      :aria-label="t('search.openPanel', '打开搜索面板')"
    >
      <div class="trigger-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <div class="trigger-stars">
        <div class="star" v-for="i in 5" :key="i"></div>
      </div>
      <div v-if="hasActiveFilters" class="active-indicator"></div>
    </button>

    <!-- 搜索面板 -->
    <transition name="panel">
      <div v-if="isExpanded" class="search-panel">
        <!-- 面板头部 -->
        <div class="panel-header">
          <h3 class="panel-title">
            <span class="title-icon">🔍</span>
            {{ t("search.starSearch", "在星河中寻找你的故事...") }}
          </h3>
          <button
            class="panel-close"
            @click="toggleExpanded"
            :aria-label="t('common.close', '关闭')"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 搜索输入区域 -->
        <div class="search-input-section">
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="t('search.placeholder', '输入关键词搜索文章...')"
              @input="handleSearch"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchQuery"
              class="clear-search"
              @click="clearSearch"
              :aria-label="t('search.clear', '清除搜索')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 标签筛选区域 -->
        <div class="tags-section">
          <div class="tags-header">
            <button
              class="tags-toggle"
              @click="toggleTagPanel"
              :class="{ 'is-active': isTagPanelOpen }"
            >
              <span class="tags-icon">🏷️</span>
              <span class="tags-text">
                {{ t("filter.tags.title", "标签筛选") }}
                <span v-if="selectedTagsCount > 0" class="tags-count"
                  >({{ selectedTagsCount }})</span
                >
              </span>
              <svg
                class="tags-arrow"
                :class="{ 'is-rotated': isTagPanelOpen }"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>

            <button
              v-if="selectedTagsCount > 0"
              class="clear-tags"
              @click="clearAllTags"
              :aria-label="t('filter.clearAll', '清除所有标签')"
            >
              {{ t("filter.clearAll", "清除") }}
            </button>
          </div>

          <!-- 标签星座图 -->
          <transition name="tags">
            <div v-if="isTagPanelOpen" class="tags-constellation">
              <div class="constellation-grid">
                <button
                  v-for="(tag, index) in allTags"
                  :key="tag"
                  class="tag-star"
                  :class="{
                    'is-selected': selectedTags.includes(tag),
                    'constellation-position': true,
                  }"
                  :style="{
                    '--star-index': index,
                    '--total-stars': allTags.length,
                  }"
                  @click="toggleTag(tag)"
                >
                  <div class="star-glow"></div>
                  <span class="star-text">{{ tag }}</span>
                  <div
                    class="star-connections"
                    v-if="selectedTags.includes(tag)"
                  ></div>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- 当前筛选状态 -->
        <div v-if="hasActiveFilters" class="filter-status">
          <div class="status-header">
            <span class="status-icon">✨</span>
            <span class="status-text">{{
              t("filter.activeFilters", "当前筛选")
            }}</span>
          </div>

          <div class="active-filters">
            <div v-if="searchQuery" class="filter-item search-filter">
              <span class="filter-label">搜索:</span>
              <span class="filter-value">{{ searchQuery }}</span>
            </div>

            <div v-if="selectedTagsCount > 0" class="filter-item tags-filter">
              <span class="filter-label">标签:</span>
              <div class="selected-tags">
                <span
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="selected-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 背景遮罩 -->
    <transition name="overlay">
      <div
        v-if="isExpanded"
        class="search-overlay"
        @click="toggleExpanded"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.star-search-panel {
  position: fixed;
  top: 6rem;
  left: 2rem;
  z-index: 1100;
}

/* 搜索触发按钮 */
.search-trigger {
  position: relative;
  width: 60px;
  height: 60px;
  background: var(--trigger-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--trigger-border);
  border-radius: 50%;
  color: var(--trigger-color);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--trigger-shadow);
  overflow: hidden;
}

.search-trigger:hover {
  background: var(--trigger-hover-bg);
  transform: scale(1.05);
  box-shadow: var(--trigger-hover-shadow);
}

/* 深浅主题触发按钮样式 */
.dark-theme .search-trigger {
  --trigger-bg: rgba(51, 65, 85, 0.8);
  --trigger-border: rgba(71, 85, 105, 0.6);
  --trigger-color: rgba(248, 250, 252, 0.9);
  --trigger-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --trigger-hover-bg: rgba(51, 65, 85, 0.9);
  --trigger-hover-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.search-trigger {
  --trigger-bg: rgba(255, 255, 255, 0.9);
  --trigger-border: rgba(203, 213, 225, 0.6);
  --trigger-color: rgba(71, 85, 105, 0.9);
  --trigger-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  --trigger-hover-bg: rgba(255, 255, 255, 0.95);
  --trigger-hover-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.trigger-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  color: #ffd700;
  z-index: 2;
}

.trigger-icon svg {
  width: 100%;
  height: 100%;
}

/* 触发按钮的星星装饰 */
.trigger-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #ffd700;
  border-radius: 50%;
  animation: twinkle 2s ease-in-out infinite;
}

.star:nth-child(1) {
  top: 15%;
  left: 20%;
  animation-delay: 0s;
}
.star:nth-child(2) {
  top: 25%;
  right: 15%;
  animation-delay: 0.5s;
}
.star:nth-child(3) {
  bottom: 20%;
  left: 25%;
  animation-delay: 1s;
}
.star:nth-child(4) {
  bottom: 15%;
  right: 20%;
  animation-delay: 1.5s;
}
.star:nth-child(5) {
  top: 50%;
  right: 10%;
  animation-delay: 0.8s;
}

.active-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: #ff6b6b;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  animation: pulse 1.5s ease-in-out infinite;
}

/* 搜索面板 */
.search-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  max-height: 80vh;
  background: var(--panel-bg);
  backdrop-filter: blur(30px);
  border: 1px solid var(--panel-border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--panel-shadow);
}

/* 深浅主题面板样式 */
.dark-theme .search-panel {
  --panel-bg: rgba(30, 41, 59, 0.95);
  --panel-border: rgba(51, 65, 85, 0.6);
  --panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.search-panel {
  --panel-bg: rgba(255, 255, 255, 0.95);
  --panel-border: rgba(203, 213, 225, 0.6);
  --panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--panel-title-color);
  margin: 0;
}

.title-icon {
  font-size: 1.2rem;
}

.panel-close {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: var(--panel-close-color);
  cursor: pointer;
  transition: color 0.3s ease;
}

.panel-close:hover {
  color: var(--panel-close-hover-color);
}

/* 深浅主题面板文字样式 */
.dark-theme .panel-title {
  --panel-title-color: rgba(248, 250, 252, 0.9);
}

.dark-theme .panel-close {
  --panel-close-color: rgba(203, 213, 225, 0.7);
  --panel-close-hover-color: rgba(248, 250, 252, 1);
}

.panel-title {
  --panel-title-color: rgba(30, 41, 59, 0.9);
}

.panel-close {
  --panel-close-color: rgba(71, 85, 105, 0.7);
  --panel-close-hover-color: rgba(30, 41, 59, 1);
}

/* 搜索输入区域 */
.search-input-section {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 12px;
  color: var(--input-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: var(--input-placeholder);
}

.search-input:focus {
  outline: none;
  border-color: var(--input-focus-border);
  background: var(--input-focus-bg);
  box-shadow: var(--input-focus-shadow);
}

.clear-search {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  color: var(--clear-color);
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: var(--clear-hover-color);
}

/* 深浅主题输入框样式 */
.dark-theme .search-input {
  --input-bg: rgba(51, 65, 85, 0.6);
  --input-border: rgba(71, 85, 105, 0.5);
  --input-color: rgba(248, 250, 252, 0.9);
  --input-placeholder: rgba(148, 163, 184, 0.6);
  --input-focus-border: #60a5fa;
  --input-focus-bg: rgba(51, 65, 85, 0.8);
  --input-focus-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
}

.dark-theme .clear-search {
  --clear-color: rgba(203, 213, 225, 0.6);
  --clear-hover-color: rgba(248, 250, 252, 1);
}

.search-input {
  --input-bg: rgba(241, 245, 249, 0.8);
  --input-border: rgba(203, 213, 225, 0.6);
  --input-color: rgba(30, 41, 59, 0.9);
  --input-placeholder: rgba(100, 116, 139, 0.6);
  --input-focus-border: #3b82f6;
  --input-focus-bg: rgba(255, 255, 255, 0.9);
  --input-focus-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.clear-search {
  --clear-color: rgba(100, 116, 139, 0.6);
  --clear-hover-color: rgba(30, 41, 59, 1);
}

/* 标签区域 */
.tags-section {
  padding: 1rem 1.5rem;
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tags-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--tags-toggle-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.tags-toggle:hover,
.tags-toggle.is-active {
  color: var(--tags-toggle-hover-color);
}

/* 深浅主题标签切换样式 */
.dark-theme .tags-toggle {
  --tags-toggle-color: rgba(203, 213, 225, 0.8);
  --tags-toggle-hover-color: rgba(248, 250, 252, 1);
}

.tags-toggle {
  --tags-toggle-color: rgba(71, 85, 105, 0.8);
  --tags-toggle-hover-color: rgba(30, 41, 59, 1);
}

.tags-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.tags-arrow.is-rotated {
  transform: rotate(180deg);
}

.tags-count {
  color: #ffd700;
  font-weight: 600;
}

.clear-tags {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-tags:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

/* 标签星座图 */
.tags-constellation {
  max-height: 200px;
  overflow-y: auto;
}

.constellation-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.tag-star {
  position: relative;
  padding: 0.5rem 0.75rem;
  background: var(--tag-star-bg);
  border: 1px solid var(--tag-star-border);
  border-radius: 20px;
  color: var(--tag-star-color);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: starAppear 0.5s ease calc(var(--star-index) * 0.1s) both;
}

.tag-star:hover {
  background: var(--tag-star-hover-bg);
  border-color: var(--tag-star-hover-border);
  transform: translateY(-2px);
}

.tag-star.is-selected {
  background: var(--tag-star-selected-bg);
  border-color: var(--tag-star-selected-border);
  color: var(--tag-star-selected-color);
  font-weight: 600;
  box-shadow: var(--tag-star-selected-shadow);
}

/* 深浅主题标签星星样式 */
.dark-theme .tag-star {
  --tag-star-bg: rgba(51, 65, 85, 0.6);
  --tag-star-border: rgba(71, 85, 105, 0.5);
  --tag-star-color: rgba(203, 213, 225, 0.8);
  --tag-star-hover-bg: rgba(51, 65, 85, 0.8);
  --tag-star-hover-border: rgba(71, 85, 105, 0.7);
  --tag-star-selected-bg: linear-gradient(135deg, #60a5fa, #3b82f6);
  --tag-star-selected-border: #3b82f6;
  --tag-star-selected-color: #ffffff;
  --tag-star-selected-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.tag-star {
  --tag-star-bg: rgba(241, 245, 249, 0.8);
  --tag-star-border: rgba(203, 213, 225, 0.6);
  --tag-star-color: rgba(71, 85, 105, 0.8);
  --tag-star-hover-bg: rgba(255, 255, 255, 0.9);
  --tag-star-hover-border: rgba(203, 213, 225, 0.8);
  --tag-star-selected-bg: linear-gradient(135deg, #3b82f6, #1d4ed8);
  --tag-star-selected-border: #1d4ed8;
  --tag-star-selected-color: #ffffff;
  --tag-star-selected-shadow: 0 0 20px rgba(29, 78, 216, 0.3);
}

.star-glow {
  position: absolute;
  inset: -2px;
  background: inherit;
  border-radius: inherit;
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tag-star.is-selected .star-glow {
  opacity: 0.6;
}

/* 筛选状态 */
.filter-status {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--filter-border);
  background: var(--filter-bg);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--status-color);
}

.filter-item {
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.filter-label {
  color: var(--filter-label-color);
  margin-right: 0.5rem;
}

.filter-value {
  color: var(--filter-value-color);
  font-weight: 500;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.selected-tag {
  padding: 0.2rem 0.5rem;
  background: var(--selected-tag-bg);
  border-radius: 8px;
  color: var(--selected-tag-color);
  font-size: 0.75rem;
}

/* 深浅主题筛选状态样式 */
.dark-theme .filter-status {
  --filter-border: rgba(51, 65, 85, 0.6);
  --filter-bg: rgba(30, 41, 59, 0.3);
  --status-color: rgba(203, 213, 225, 0.8);
  --filter-label-color: rgba(148, 163, 184, 0.6);
  --filter-value-color: #60a5fa;
  --selected-tag-bg: rgba(59, 130, 246, 0.2);
  --selected-tag-color: #60a5fa;
}

.filter-status {
  --filter-border: rgba(203, 213, 225, 0.6);
  --filter-bg: rgba(248, 250, 252, 0.5);
  --status-color: rgba(71, 85, 105, 0.8);
  --filter-label-color: rgba(100, 116, 139, 0.6);
  --filter-value-color: #3b82f6;
  --selected-tag-bg: rgba(59, 130, 246, 0.1);
  --selected-tag-color: #1d4ed8;
}

/* 背景遮罩 */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

/* 动画 */
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes starAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 过渡动画 */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.panel-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}

.tags-enter-active,
.tags-leave-active {
  transition: all 0.3s ease;
}

.tags-enter-from,
.tags-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .star-search-panel {
    top: 1rem;
    left: 1rem;
  }

  .search-panel {
    width: calc(100vw - 2rem);
    max-width: 350px;
  }

  .panel-header,
  .search-input-section,
  .tags-section,
  .filter-status {
    padding: 1rem;
  }
}

/* 滚动条样式 */
.tags-constellation::-webkit-scrollbar {
  width: 4px;
}

.tags-constellation::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.tags-constellation::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}
</style>

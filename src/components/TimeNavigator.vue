<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  years: {
    type: Array,
    default: () => [],
  },
  selectedYear: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["year-select"]);

const { t } = useI18n();
const isExpanded = ref(false);

// 切换展开状态
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

// 选择年份
const selectYear = (year) => {
  emit("year-select", year === props.selectedYear ? null : year);
  isExpanded.value = false;
};

// 清除选择
const clearSelection = () => {
  emit("year-select", null);
  isExpanded.value = false;
};

// 计算当前选择的显示文本
const selectedText = computed(() => {
  return props.selectedYear
    ? props.selectedYear.toString()
    : t("blog.allTime", "全部时间");
});
</script>

<template>
  <div class="time-navigator" :class="{ 'is-expanded': isExpanded }">
    <!-- 导航器触发按钮 -->
    <button
      class="navigator-trigger"
      @click="toggleExpanded"
      :aria-label="t('blog.timeNavigation', '时间导航')"
    >
      <div class="trigger-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      </div>
      <span class="trigger-text">{{ selectedText }}</span>
      <div class="trigger-arrow" :class="{ 'is-rotated': isExpanded }">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </div>
    </button>

    <!-- 年份选择面板 -->
    <transition name="panel">
      <div v-if="isExpanded" class="navigator-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            {{ t("blog.selectTimeRange", "选择时间范围") }}
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

        <div class="panel-content">
          <!-- 全部时间选项 -->
          <button
            class="year-option all-time"
            :class="{ 'is-selected': !selectedYear }"
            @click="clearSelection"
          >
            <div class="option-icon">✨</div>
            <span class="option-text">{{ t("blog.allTime", "全部时间") }}</span>
          </button>

          <!-- 年份选项 -->
          <div class="years-grid">
            <button
              v-for="year in years"
              :key="year"
              class="year-option"
              :class="{ 'is-selected': year === selectedYear }"
              @click="selectYear(year)"
            >
              <div class="option-icon">📅</div>
              <span class="option-text">{{ year }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 背景遮罩 -->
    <transition name="overlay">
      <div
        v-if="isExpanded"
        class="navigator-overlay"
        @click="toggleExpanded"
      ></div>
    </transition>
  </div>
</template>

<style scoped>
.time-navigator {
  position: fixed;
  top: 6rem;
  right: 2rem;
  z-index: 1100;
}

/* 触发按钮 */
.navigator-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--nav-trigger-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--nav-trigger-border);
  border-radius: 50px;
  color: var(--nav-trigger-color);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--nav-trigger-shadow);
}

.navigator-trigger:hover {
  background: var(--nav-trigger-hover-bg);
  transform: translateY(-2px);
  box-shadow: var(--nav-trigger-hover-shadow);
}

/* 深浅主题导航触发按钮样式 */
.dark-theme .navigator-trigger {
  --nav-trigger-bg: rgba(51, 65, 85, 0.8);
  --nav-trigger-border: rgba(71, 85, 105, 0.6);
  --nav-trigger-color: rgba(248, 250, 252, 0.9);
  --nav-trigger-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  --nav-trigger-hover-bg: rgba(51, 65, 85, 0.9);
  --nav-trigger-hover-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.navigator-trigger {
  --nav-trigger-bg: rgba(255, 255, 255, 0.9);
  --nav-trigger-border: rgba(203, 213, 225, 0.6);
  --nav-trigger-color: rgba(71, 85, 105, 0.9);
  --nav-trigger-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  --nav-trigger-hover-bg: rgba(255, 255, 255, 0.95);
  --nav-trigger-hover-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.trigger-icon {
  width: 20px;
  height: 20px;
  color: #ffd700;
}

.trigger-icon svg {
  width: 100%;
  height: 100%;
}

.trigger-text {
  white-space: nowrap;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.trigger-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.trigger-arrow.is-rotated {
  transform: rotate(180deg);
}

.trigger-arrow svg {
  width: 100%;
  height: 100%;
}

/* 选择面板 */
.navigator-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  max-height: 400px;
  background: var(--nav-panel-bg);
  backdrop-filter: blur(30px);
  border: 1px solid var(--nav-panel-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--nav-panel-shadow);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--nav-panel-border);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--nav-panel-title-color);
  margin: 0;
}

.panel-close {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: var(--nav-panel-close-color);
  cursor: pointer;
  transition: color 0.3s ease;
}

.panel-close:hover {
  color: var(--nav-panel-close-hover-color);
}

/* 深浅主题导航面板样式 */
.dark-theme .navigator-panel {
  --nav-panel-bg: rgba(30, 41, 59, 0.95);
  --nav-panel-border: rgba(51, 65, 85, 0.6);
  --nav-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  --nav-panel-title-color: rgba(248, 250, 252, 0.9);
  --nav-panel-close-color: rgba(203, 213, 225, 0.7);
  --nav-panel-close-hover-color: rgba(248, 250, 252, 1);
}

.navigator-panel {
  --nav-panel-bg: rgba(255, 255, 255, 0.95);
  --nav-panel-border: rgba(203, 213, 225, 0.6);
  --nav-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  --nav-panel-title-color: rgba(30, 41, 59, 0.9);
  --nav-panel-close-color: rgba(71, 85, 105, 0.7);
  --nav-panel-close-hover-color: rgba(30, 41, 59, 1);
}

.panel-close svg {
  width: 100%;
  height: 100%;
}

.panel-content {
  padding: 1rem;
  max-height: 320px;
  overflow-y: auto;
}

/* 年份选项 */
.year-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid var(--year-option-border);
  border-radius: 12px;
  color: var(--year-option-color);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.year-option:hover {
  background: var(--year-option-hover-bg);
  border-color: var(--year-option-hover-border);
  color: var(--year-option-hover-color);
  transform: translateX(5px);
}

.year-option.is-selected {
  background: var(--year-option-selected-bg);
  border-color: var(--year-option-selected-border);
  color: var(--year-option-selected-color);
  font-weight: 600;
}

.year-option.all-time {
  margin-bottom: 1rem;
  border-color: var(--year-option-all-time-border);
}

.year-option.all-time:hover {
  border-color: var(--year-option-all-time-hover-border);
}

/* 深浅主题年份选项样式 */
.dark-theme .year-option {
  --year-option-border: rgba(51, 65, 85, 0.6);
  --year-option-color: rgba(203, 213, 225, 0.8);
  --year-option-hover-bg: rgba(51, 65, 85, 0.6);
  --year-option-hover-border: rgba(71, 85, 105, 0.8);
  --year-option-hover-color: rgba(248, 250, 252, 1);
  --year-option-selected-bg: linear-gradient(135deg, #60a5fa, #3b82f6);
  --year-option-selected-border: #3b82f6;
  --year-option-selected-color: #ffffff;
  --year-option-all-time-border: rgba(96, 165, 250, 0.3);
  --year-option-all-time-hover-border: rgba(96, 165, 250, 0.6);
}

.year-option {
  --year-option-border: rgba(203, 213, 225, 0.6);
  --year-option-color: rgba(71, 85, 105, 0.8);
  --year-option-hover-bg: rgba(241, 245, 249, 0.8);
  --year-option-hover-border: rgba(203, 213, 225, 0.8);
  --year-option-hover-color: rgba(30, 41, 59, 1);
  --year-option-selected-bg: linear-gradient(135deg, #3b82f6, #1d4ed8);
  --year-option-selected-border: #1d4ed8;
  --year-option-selected-color: #ffffff;
  --year-option-all-time-border: rgba(59, 130, 246, 0.3);
  --year-option-all-time-hover-border: rgba(59, 130, 246, 0.6);
}

.option-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  text-align: left;
}

.years-grid {
  display: flex;
  flex-direction: column;
}

/* 背景遮罩 */
.navigator-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

/* 过渡动画 */
.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.panel-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
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
  .time-navigator {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    top: auto;
    transform: none;
  }

  .navigator-trigger {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .trigger-text {
    display: none;
  }

  .navigator-panel {
    position: fixed;
    bottom: 5rem;
    right: 1rem;
    left: 1rem;
    width: auto;
    max-height: 50vh;
  }

  .panel-content {
    max-height: calc(50vh - 80px);
  }
}

/* 滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 4px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

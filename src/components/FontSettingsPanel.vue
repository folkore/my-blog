<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useReadingPreferences } from "../composables/useReadingPreferences";

const {
  fontSettings,
  updateFontSettings,
  resetFontSettings,
  brightnessSettings,
  updateBrightnessSettings,
} = useReadingPreferences();

// 面板状态
const isOpen = ref(false);
const isDragging = ref(false);
// 面板位置不再使用拖拽定位，而是固定在头部
const panelRef = ref(null);

// 字体选项
const fontFamilyOptions = [
  { value: "system", label: "系统默认", preview: "System Font" },
  { value: "serif", label: "衬线字体", preview: "Serif Font" },
  { value: "sans-serif", label: "无衬线字体", preview: "Sans-serif Font" },
];

// 切换面板显示
const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

// 关闭面板
const closePanel = () => {
  isOpen.value = false;
};

// 更新字体大小
const updateFontSize = (size) => {
  const newSize = Math.max(12, Math.min(24, size));
  updateFontSettings({ fontSize: newSize });
};

// 更新行高
const updateLineHeight = (height) => {
  const newHeight = Math.max(1.4, Math.min(2.0, height));
  updateFontSettings({ lineHeight: newHeight });
};

// 更新字体家族
const updateFontFamily = (family) => {
  updateFontSettings({ fontFamily: family });
};

// 更新亮度
const updateBrightness = (brightness) => {
  updateBrightnessSettings(brightness);
};

// 重置所有设置
const resetAllSettings = () => {
  resetFontSettings();
  updateBrightnessSettings(1.0);
};

// 点击外部关闭面板
const handleClickOutside = (event) => {
  if (
    !event.target.closest(".font-settings-panel") &&
    !event.target.closest(".font-settings-trigger")
  ) {
    closePanel();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="font-settings-wrapper">
    <!-- 触发按钮 -->
    <button
      class="font-settings-trigger"
      @click="togglePanel"
      :class="{ active: isOpen }"
      :title="isOpen ? '关闭字体设置' : '打开字体设置'"
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
        class="font-icon"
      >
        <path d="M4 7V4h16v3" />
        <path d="M9 20h6" />
        <path d="M12 4v16" />
      </svg>
    </button>

    <!-- 设置面板 -->
    <Transition name="panel-fade">
      <div v-if="isOpen" ref="panelRef" class="font-settings-panel">
        <!-- 面板头部 -->
        <div class="panel-header">
          <div class="panel-title">
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
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
            阅读设置
          </div>
          <button class="close-button" @click="closePanel" title="关闭设置面板">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 面板内容 -->
        <div class="panel-content">
          <!-- 字体大小 -->
          <div class="setting-group">
            <label class="setting-label">
              字体大小
              <span class="setting-value">{{ fontSettings.fontSize }}px</span>
            </label>
            <div class="slider-container">
              <button
                class="slider-btn"
                @click="updateFontSize(fontSettings.fontSize - 2)"
                :disabled="fontSettings.fontSize <= 12"
              >
                A-
              </button>
              <input
                type="range"
                min="12"
                max="24"
                step="2"
                :value="fontSettings.fontSize"
                @input="updateFontSize(Number($event.target.value))"
                class="slider"
              />
              <button
                class="slider-btn"
                @click="updateFontSize(fontSettings.fontSize + 2)"
                :disabled="fontSettings.fontSize >= 24"
              >
                A+
              </button>
            </div>
          </div>

          <!-- 行高 -->
          <div class="setting-group">
            <label class="setting-label">
              行高
              <span class="setting-value">{{
                fontSettings.lineHeight.toFixed(1)
              }}</span>
            </label>
            <div class="slider-container">
              <button
                class="slider-btn"
                @click="updateLineHeight(fontSettings.lineHeight - 0.2)"
                :disabled="fontSettings.lineHeight <= 1.4"
              >
                ↕-
              </button>
              <input
                type="range"
                min="1.4"
                max="2.0"
                step="0.2"
                :value="fontSettings.lineHeight"
                @input="updateLineHeight(Number($event.target.value))"
                class="slider"
              />
              <button
                class="slider-btn"
                @click="updateLineHeight(fontSettings.lineHeight + 0.2)"
                :disabled="fontSettings.lineHeight >= 2.0"
              >
                ↕+
              </button>
            </div>
          </div>

          <!-- 字体家族 -->
          <div class="setting-group">
            <label class="setting-label">字体类型</label>
            <div class="font-family-options">
              <button
                v-for="option in fontFamilyOptions"
                :key="option.value"
                class="font-option"
                :class="{ active: fontSettings.fontFamily === option.value }"
                @click="updateFontFamily(option.value)"
              >
                <span class="option-label">{{ option.label }}</span>
                <span
                  class="option-preview"
                  :style="{
                    fontFamily:
                      option.value === 'system'
                        ? 'var(--font-sans)'
                        : option.value,
                  }"
                >
                  {{ option.preview }}
                </span>
              </button>
            </div>
          </div>

          <!-- 亮度控制 -->
          <div class="setting-group">
            <label class="setting-label">
              亮度
              <span class="setting-value"
                >{{
                  isNaN(brightnessSettings)
                    ? 100
                    : Math.round(brightnessSettings * 100)
                }}%</span
              >
            </label>
            <div class="slider-container">
              <button
                class="slider-btn"
                @click="updateBrightness(brightnessSettings - 0.1)"
                :disabled="brightnessSettings <= 0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                :value="brightnessSettings"
                @input="updateBrightness(Number($event.target.value))"
                class="slider"
              />
              <button
                class="slider-btn"
                @click="updateBrightness(brightnessSettings + 0.1)"
                :disabled="brightnessSettings >= 1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                +
              </button>
            </div>
          </div>

          <!-- 重置按钮 -->
          <button class="reset-btn" @click="resetAllSettings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            重置所有设置
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 字体设置按钮与面板样式 */
.font-settings-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.font-settings-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0; /* 重置全局button的padding */
  border-radius: var(--radius-lg);
  background: var(--color-tertiary-background);
  border: 1px solid var(--color-border);
  color: var(--color-secondary-text);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: inherit; /* 重置全局button的font-size */
  font-weight: inherit; /* 重置全局button的font-weight */
}

.font-settings-trigger:hover,
.font-settings-trigger.active {
  color: var(--color-text);
  background: var(--color-secondary-background);
  border-color: var(--color-border);
}

.font-icon {
  flex-shrink: 0;
  opacity: 1;
  transition: all var(--transition-normal);
}

/* 字体设置面板 */
.font-settings-panel {
  position: absolute;
  top: calc(100% + 0.5rem); /* 正好在按钮下方 */
  right: 0;
  width: 280px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(var(--blur-lg));
  -webkit-backdrop-filter: blur(var(--blur-lg));
  overflow: hidden; /* 改为hidden，让内容区域单独处理滚动 */
  user-select: none;
  z-index: 1001;
}

/* 在文章工具栏中的特殊样式 */
.article-toolbar .font-settings-panel {
  z-index: 100; /* 降低z-index，避免与sticky工具栏冲突 */
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-secondary-background);
  border-bottom: 1px solid var(--color-border);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  position: relative;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-lg);
  background: transparent;
  border: none;
  color: var(--color-secondary-text);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.close-button:hover {
  color: var(--color-text);
  background: var(--color-tertiary-background);
}

/* 面板内容 */
.panel-content {
  padding: 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

/* 设置组 */
.setting-group {
  margin-bottom: 1.5rem;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text, #1e293b);
}

.setting-value {
  font-size: 0.75rem;
  color: var(--color-primary);
  background: var(--color-tertiary-background, #f1f5f9);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-md, 0.375rem);
}

/* 滑块容器 */
.slider-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.slider-btn {
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--color-border, #e2e8f0);
  background: var(--color-card-background, #ffffff);
  color: var(--color-text, #1e293b);
  border-radius: var(--radius-md, 0.375rem);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 0.75rem;
  font-weight: 500;

  transition: all var(--transition-normal);
}

.slider-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.slider-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider {
  flex: 1;
  height: 0.25rem;
  background: var(--color-tertiary-background, #f1f5f9);
  border-radius: var(--radius-full, 9999px);
  outline: none;
  cursor: pointer;

  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 0 0.25rem rgba(var(--color-primary-rgb, 59, 130, 246), 0.2);
}

.slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  background: var(--color-primary);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all var(--transition-normal);
}

/* 字体选项 */
.font-family-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.font-option {
  padding: 0.75rem;
  background: var(--color-card-background, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-md, 0.375rem);
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  transition: all var(--transition-normal);
}

.font-option:hover {
  border-color: var(--color-primary);
  background: var(--color-secondary-background, #f8fafc);
}

.font-option.active {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.05);
}

.option-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text, #1e293b);
}

.option-preview {
  font-size: 0.75rem;
  color: var(--color-secondary-text, #475569);
}

/* 重置按钮 */
.reset-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-tertiary-background, #f1f5f9);
  border: 1px solid var(--color-border, #e2e8f0);
  color: var(--color-text, #1e293b);
  border-radius: var(--radius-md, 0.375rem);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  font-size: 0.875rem;
  font-weight: 500;

  transition: all var(--transition-normal);
}

.reset-btn:hover {
  background: var(--color-error, #ef4444);
  color: white;
  border-color: var(--color-error, #ef4444);
}

/* 动画效果 */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: all 0.2s ease-out;
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 暗色主题适配 */
.dark-theme .font-settings-trigger {
  background: var(--color-tertiary-background);
  border-color: var(--color-border);
  color: var(--color-secondary-text);
}

.dark-theme .font-settings-trigger:hover,
.dark-theme .font-settings-trigger.active {
  background: var(--color-secondary-background);
  color: var(--color-text);
}

.dark-theme .font-settings-panel {
  background: var(--color-background);
  border-color: var(--color-border);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.2);
}

.dark-theme .panel-header {
  background: var(--color-secondary-background);
  border-bottom-color: var(--color-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .font-settings-panel {
    position: fixed;
    top: auto;
    bottom: 5rem;
    left: 1rem;
    right: 1rem;
    width: auto;
    max-height: 60vh;
    z-index: 1000;
  }

  /* 在文章工具栏中的移动端样式 */
  .article-toolbar .font-settings-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: auto;
    right: auto;
    width: calc(100vw - 2rem);
    max-width: 320px;
    max-height: 80vh;
    z-index: 1000;
    box-shadow: var(--shadow-xl);
  }
}

@media (max-width: 480px) {
  .panel-content {
    padding: 0.875rem;
  }

  .setting-group {
    margin-bottom: 1.25rem;
  }

  .slider-container {
    gap: 0.5rem;
  }

  .slider-btn {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.6875rem;
  }
}
</style>

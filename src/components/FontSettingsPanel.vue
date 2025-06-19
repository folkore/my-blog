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
const panelPosition = ref({ x: 0, y: 0 });
const panelRef = ref(null);

// 字体选项
const fontFamilyOptions = [
  { value: "system", label: "系统默认", preview: "System Font" },
  { value: "serif", label: "衬线字体", preview: "Serif Font" },
  { value: "sans-serif", label: "无衬线字体", preview: "Sans-serif Font" },
];

// 计算属性已移除，直接在模板中使用 fontSettings.fontFamily

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

// 重置面板位置
const resetPanelPosition = () => {
  panelPosition.value = { x: 0, y: 0 };
};

// 拖拽相关
let dragStartX = 0;
let dragStartY = 0;
let initialX = 0;
let initialY = 0;

// 边界检查函数
const constrainPosition = (x, y) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const panelWidth = 280;
  const panelHeight = Math.min(400, viewportHeight * 0.6); // 面板高度

  // 计算面板的初始位置（基于CSS：top: 20vh, right: 5rem）
  const baseTop = viewportHeight * 0.2; // 20vh
  const baseRight = 112; // 7rem = 112px
  const baseLeft = viewportWidth - baseRight - panelWidth;

  // 边界约束 - 确保面板始终在视口内
  const minX = -baseLeft + 20; // 左边界，保留20px
  const maxX = viewportWidth - baseRight - 20; // 右边界，保留20px

  // 头部菜单高度，防止拖拽到导航区域
  const headerSafeZone = 72; // 72px 高度

  // 计算允许的顶部偏移量，使面板顶部始终位于 headerSafeZone 之下
  const minY = Math.max(-baseTop + 20, headerSafeZone - baseTop);

  const maxY = viewportHeight - baseTop - panelHeight - 20; // 下边界，保留20px

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
};

const startDrag = (event) => {
  // 移动端禁用拖拽
  if (window.innerWidth <= 768) return;

  // 只允许在面板头部拖拽
  if (!event.target.closest(".panel-header")) return;

  event.preventDefault();
  isDragging.value = true;

  const clientX =
    event.type === "mousedown" ? event.clientX : event.touches[0].clientX;
  const clientY =
    event.type === "mousedown" ? event.clientY : event.touches[0].clientY;

  dragStartX = clientX;
  dragStartY = clientY;
  initialX = panelPosition.value.x;
  initialY = panelPosition.value.y;

  // 添加事件监听器
  document.addEventListener("mousemove", handleDrag, { passive: false });
  document.addEventListener("mouseup", stopDrag, { passive: false });
  document.addEventListener("touchmove", handleDrag, { passive: false });
  document.addEventListener("touchend", stopDrag, { passive: false });

  // 防止文本选择
  document.body.style.userSelect = "none";
  document.body.style.webkitUserSelect = "none";
};

const handleDrag = (event) => {
  if (!isDragging.value) return;

  event.preventDefault();

  const clientX =
    event.type === "mousemove" ? event.clientX : event.touches[0].clientX;
  const clientY =
    event.type === "mousemove" ? event.clientY : event.touches[0].clientY;

  const deltaX = clientX - dragStartX;
  const deltaY = clientY - dragStartY;

  // 应用边界约束
  const newPosition = constrainPosition(initialX + deltaX, initialY + deltaY);

  panelPosition.value = newPosition;
};

const stopDrag = () => {
  isDragging.value = false;

  // 移除所有事件监听器
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchmove", handleDrag);
  document.removeEventListener("touchend", stopDrag);

  // 恢复文本选择
  document.body.style.userSelect = "";
  document.body.style.webkitUserSelect = "";
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
  stopDrag();
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
        width="24"
        height="24"
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
    </button>

    <!-- 设置面板 -->
    <Transition name="panel-fade">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="font-settings-panel"
        :class="{ dragging: isDragging }"
        :style="{
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
        }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <!-- 面板头部 -->
        <div class="panel-header" title="拖拽此区域移动面板">
          <!-- 拖拽指示器 -->
          <div class="drag-indicator">
            <div class="drag-dots">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

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

          <div class="panel-actions">
            <button
              class="panel-reset"
              @click="resetPanelPosition"
              title="重置位置"
              v-if="panelPosition.x !== 0 || panelPosition.y !== 0"
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
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>
            <button class="panel-close" @click="closePanel" title="关闭">
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
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
                >{{ Math.round(brightnessSettings.brightness * 100) }}%</span
              >
            </label>
            <div class="slider-container">
              <button
                class="slider-btn"
                @click="updateBrightness(brightnessSettings.brightness - 0.1)"
                :disabled="brightnessSettings.brightness <= 0.6"
              >
                ☀-
              </button>
              <input
                type="range"
                min="0.6"
                max="1.0"
                step="0.1"
                :value="brightnessSettings.brightness"
                @input="updateBrightness(Number($event.target.value))"
                class="slider"
              />
              <button
                class="slider-btn"
                @click="updateBrightness(brightnessSettings.brightness + 0.1)"
                :disabled="brightnessSettings.brightness >= 1.0"
              >
                ☀+
              </button>
            </div>
          </div>

          <!-- 重置按钮 -->
          <div class="setting-group">
            <button class="reset-btn" @click="resetAllSettings">
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
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              重置设置
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 补充缺失的CSS变量 */
.font-settings-wrapper {
  /* 确保所有必要的CSS变量都有默认值 */
  --color-card-background: var(--card-bg, #ffffff);
  --color-border: var(--border-color, #e2e8f0);
  --color-secondary-background: var(--bg-secondary, #f8fafc);
  --color-tertiary-background: var(--bg-secondary, #f1f5f9);
  --color-text: var(--text-primary, #1e293b);
  --color-secondary-text: var(--text-secondary, #475569);
  --color-primary: var(--primary-color, #3385ff);
  --color-primary-rgb: 51, 133, 255;
  --color-error: #ef4444;
  --radius-xl: 0.75rem;
  --radius-md: 0.375rem;
  --radius-full: 9999px;
  --shadow-xl:
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --blur-lg: 16px;
  --transition-normal: 0.3s;
  --bezier-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  /* 移除 transform，防止影响子元素 position: fixed 的参照系 */
  position: fixed;
  top: calc(50vh - 28px); /* 56px 按钮高度的一半，保持按钮垂直居中 */
  right: 2rem;
  z-index: 1000;
}

/* 触发按钮 */
.font-settings-trigger {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-card-background);
  border: none;
  color: var(--color-text);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: var(--shadow-xl);

  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.font-settings-trigger:hover {
  transform: translateY(-5px);
  background-color: var(--color-primary);
  color: white;
}

.font-settings-trigger.active {
  background-color: var(--color-primary);
  color: white;
}

/* 设置面板 */
.font-settings-panel {
  position: fixed;
  top: 20vh; /* 从顶部20%开始，确保完全可见 */
  right: 7rem; /* 稍远离触发按钮 */
  width: 280px;
  max-width: calc(100vw - 6rem); /* 确保不超出屏幕 */
  max-height: 60vh; /* 限制最大高度为60%视口高度 */

  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);

  backdrop-filter: blur(var(--blur-lg));
  -webkit-backdrop-filter: blur(var(--blur-lg));

  overflow: hidden; /* 改为hidden，让内容区域单独处理滚动 */
  user-select: none;
  z-index: 1001;
}

.font-settings-panel.dragging {
  cursor: grabbing;
  transform-origin: center;
  box-shadow:
    var(--shadow-xl),
    0 0 0 1px var(--color-primary);
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-secondary-background);
  border-bottom: 1px solid var(--color-border);
  cursor: grab;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  position: relative;

  /* 增强拖拽区域的视觉提示 */
  transition: background-color var(--transition-normal);
}

.panel-header:hover {
  background: var(--color-tertiary-background);
}

.panel-header:active {
  cursor: grabbing;
  background: var(--color-tertiary-background);
}

/* 拖拽指示器 - 改进设计 */
.drag-indicator {
  margin-right: 0.75rem;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-normal);
}

.panel-header:hover .drag-indicator {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.drag-dots {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 3px;
  align-items: center;
  justify-items: center;
  width: 16px;
  height: 20px;
}

.drag-dots span {
  width: 4px;
  height: 4px;
  background: var(--color-secondary-text);
  border-radius: 50%;
  opacity: 0.7;
  transition: all var(--transition-normal);
}

.panel-header:hover .drag-dots span {
  background: var(--color-primary);
  opacity: 1;
  transform: scale(1.2);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-text, #1e293b);
  font-size: 0.875rem;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-reset,
.panel-close {
  padding: 0.25rem;
  background: transparent;
  border: none;
  color: var(--color-secondary-text, #475569);
  cursor: pointer;
  border-radius: var(--radius-md, 0.375rem);
  transition: all var(--transition-normal);

  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-reset:hover,
.panel-close:hover {
  background: var(--color-tertiary-background, #f1f5f9);
  color: var(--color-text, #1e293b);
}

.panel-reset {
  color: var(--color-primary);
}

.panel-reset:hover {
  background: rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
  color: var(--color-primary);
}

/* 面板内容 */
.panel-content {
  padding: 1rem;
  cursor: default;
  overflow-y: auto;
  max-height: calc(60vh - 80px); /* 减去头部高度 */

  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: transparent;
}

.panel-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-full);
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-secondary-text);
}

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
  transition: all 0.3s var(--bezier-smooth);
}

.panel-fade-enter-from {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
}

.panel-fade-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.98);
}

/* 暗色主题适配 */
.dark-theme .font-settings-panel {
  background: var(--color-card-background);
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
  .font-settings-wrapper {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    top: auto;
    /* 移除 transform，保证移动端参照视口 */
  }

  .font-settings-panel {
    position: fixed;
    bottom: 5rem;
    right: 1rem;
    left: 1rem;
    top: auto;
    width: auto;
    max-height: 60vh;
    overflow-y: auto;
    z-index: 1000;
    transform: none !important; /* 移动端不使用拖拽变换 */
  }

  .font-settings-trigger {
    width: 56px;
    height: 56px;
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

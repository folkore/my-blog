<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { setLanguage } from "../i18n";

const { locale } = useI18n();

const languages = [
  {
    code: "zh-CN",
    name: "中文",
    shortName: "中",
    flag: "🇨🇳",
  },
  {
    code: "en-US",
    name: "English",
    shortName: "EN",
    flag: "🇺🇸",
  },
];

const currentLanguage = computed(() => locale.value);
const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

const currentLangData = computed(
  () =>
    languages.find((lang) => lang.code === currentLanguage.value) ||
    languages[0]
);

const switchLanguage = (lang) => {
  setLanguage(lang);
  isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (event) => {
  if (!dropdownRef.value?.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

// 键盘导航支持
const handleKeydown = (event) => {
  if (event.key === "Escape") {
    isDropdownOpen.value = false;
  }
};

// 点击外部关闭下拉菜单
onMounted(() => {
  document.addEventListener("click", closeDropdown);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
  document.removeEventListener("keydown", handleKeydown);
});

// 确保当前语言正确显示
watch(
  currentLanguage,
  (newVal) => {
    console.log("当前语言切换为:", newVal);
  },
  { immediate: true }
);
</script>

<template>
  <div ref="dropdownRef" class="language-switcher">
    <button
      class="lang-dropdown-toggle"
      @click.stop="toggleDropdown"
      :title="currentLanguage === 'zh-CN' ? '切换语言' : 'Switch language'"
      :aria-expanded="isDropdownOpen"
      :aria-haspopup="true"
      aria-label="Language selector"
    >
      <div class="lang-current">
        <span class="lang-flag">{{ currentLangData.flag }}</span>
        <span class="lang-name">{{ currentLangData.shortName }}</span>
      </div>
      <svg
        class="dropdown-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="{ 'dropdown-icon--open': isDropdownOpen }"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="isDropdownOpen" class="lang-dropdown" role="menu">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLanguage(lang.code)"
          :class="{ 'lang-option--active': currentLanguage === lang.code }"
          class="lang-option"
          role="menuitem"
          :aria-selected="currentLanguage === lang.code"
        >
          <span class="lang-flag">{{ lang.flag }}</span>
          <span class="lang-name">{{ lang.name }}</span>
          <span v-if="currentLanguage === lang.code" class="lang-check">
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
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 语言切换器容器 */
.language-switcher {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* 下拉按钮样式 */
.lang-dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-secondary-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal, 0.3s)
    var(--bezier-smooth, cubic-bezier(0.4, 0, 0.2, 1));
  white-space: nowrap;
  min-width: 72px;
  position: relative;
  overflow: hidden;
}

/* 按钮悬停效果 */
.lang-dropdown-toggle:hover {
  background: var(--color-tertiary-background);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow:
    0 4px 12px rgba(var(--color-primary-rgb, 0, 102, 255), 0.15),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 按钮激活状态 */
.lang-dropdown-toggle:active {
  transform: translateY(0);
  box-shadow:
    0 2px 8px rgba(var(--color-primary-rgb, 0, 102, 255), 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 当前语言显示区域 */
.lang-current {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.lang-flag {
  font-size: 1rem;
  line-height: 1;
}

.lang-name {
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* 下拉图标 */
.dropdown-icon {
  transition: transform var(--transition-normal, 0.3s)
    var(--bezier-smooth, cubic-bezier(0.4, 0, 0.2, 1));
  opacity: 0.7;
}

.dropdown-icon--open {
  transform: rotate(180deg);
  opacity: 1;
}

/* 下拉菜单容器 */
.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  overflow: hidden;
  min-width: 140px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* 语言选项样式 */
.lang-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast, 0.2s)
    var(--bezier-smooth, cubic-bezier(0.4, 0, 0.2, 1));
  white-space: nowrap;
  position: relative;
}

/* 语言选项悬停效果 */
.lang-option:hover {
  background: var(--color-secondary-background);
  color: var(--color-primary);
  /* 移除右移动画，改为更subtle的视觉反馈 */
}

/* 激活状态的语言选项 */
.lang-option--active {
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 0, 102, 255), 0.08);
  font-weight: 600;
}

.lang-option--active:hover {
  background: rgba(var(--color-primary-rgb, 0, 102, 255), 0.12);
  /* 移除右移动画 */
}

/* 语言选项内的元素 */
.lang-option .lang-flag {
  font-size: 1.125rem;
}

.lang-option .lang-name {
  flex: 1;
  text-align: left;
  margin-left: 0.5rem;
  font-weight: inherit;
}

.lang-check {
  color: var(--color-primary);
  opacity: 1;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lang-check svg {
  width: 16px;
  height: 16px;
  stroke-width: 2.5;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 下拉菜单动画 */
.dropdown-enter-active {
  transition: all var(--transition-normal, 0.3s)
    var(--bezier-smooth, cubic-bezier(0.4, 0, 0.2, 1));
}

.dropdown-leave-active {
  transition: all var(--transition-fast, 0.2s)
    var(--bezier-smooth, cubic-bezier(0.4, 0, 0.2, 1));
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

/* 深色模式适配 */
.dark-theme .lang-dropdown-toggle {
  background: var(--color-secondary-background);
  border-color: var(--color-border);
  color: var(--color-text);
}

.dark-theme .lang-dropdown-toggle:hover {
  background: var(--color-tertiary-background);
  border-color: var(--color-primary);
  box-shadow:
    0 4px 12px rgba(var(--color-primary-rgb, 51, 133, 255), 0.25),
    0 2px 4px rgba(0, 0, 0, 0.3);
}

.dark-theme .lang-dropdown-toggle:active {
  background: var(--color-tertiary-background);
  box-shadow:
    0 2px 8px rgba(var(--color-primary-rgb, 51, 133, 255), 0.3),
    0 1px 2px rgba(0, 0, 0, 0.3);
}

.dark-theme .lang-dropdown {
  background: var(--color-secondary-background);
  border-color: var(--color-border);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.dark-theme .lang-option {
  color: var(--color-text);
}

.dark-theme .lang-option:hover {
  background: var(--color-tertiary-background);
  color: var(--color-primary);
  /* 移除右移动画 */
}

.dark-theme .lang-option--active {
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 51, 133, 255), 0.15);
}

.dark-theme .lang-option--active:hover {
  background: rgba(var(--color-primary-rgb, 51, 133, 255), 0.2);
  /* 移除右移动画 */
}

.dark-theme .lang-check {
  color: var(--color-primary);
}

.dark-theme .lang-check svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

/* 移动端样式优化 */
@media (max-width: 768px) {
  .language-switcher {
    width: 100%;
  }

  .lang-dropdown-toggle {
    width: 100%;
    padding: 0.75rem 1rem;
    justify-content: space-between;
    font-size: 1rem;
    min-width: unset;
  }

  .lang-current {
    gap: 0.5rem;
  }

  .lang-flag {
    font-size: 1.125rem;
  }

  .lang-name {
    font-size: 1rem;
  }

  .lang-dropdown {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    min-width: unset;
    border-radius: 20px;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(0, 0, 0, 0.05);
  }

  .lang-option {
    padding: 1rem;
    font-size: 1rem;
  }

  .lang-option .lang-flag {
    font-size: 1.25rem;
  }

  .lang-option .lang-name {
    font-size: 1rem;
    margin-left: 0.75rem;
  }

  /* 移动端深色模式 */
  .dark-theme .lang-dropdown {
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}

/* 桌面端优化 */
@media (min-width: 769px) {
  .lang-dropdown-toggle:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  .lang-option:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
}
</style>

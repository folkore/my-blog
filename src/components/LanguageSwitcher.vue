<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { setLanguage } from "../i18n";

const { locale } = useI18n();

const languages = [
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "en-US", name: "English", flag: "🇺🇸" },
];

const isOpen = ref(false);

const currentLanguage = computed(() => {
  return languages.find((lang) => lang.code === locale.value) || languages[0];
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLanguage = (langCode) => {
  setLanguage(langCode);
  isOpen.value = false;
};

// 点击外部关闭下拉菜单
const closeDropdown = (event) => {
  if (!event.target.closest(".language-switcher")) {
    isOpen.value = false;
  }
};

// 添加全局点击事件监听
onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<template>
  <div class="language-switcher">
    <button
      class="language-button"
      @click.stop="toggleDropdown"
      :title="currentLanguage.name"
    >
      <span class="language-flag">{{ currentLanguage.flag }}</span>
      <span class="language-name">{{ currentLanguage.name }}</span>
      <svg
        class="dropdown-icon"
        :class="{ 'dropdown-open': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div class="language-dropdown" v-show="isOpen">
      <button
        v-for="lang in languages"
        :key="lang.code"
        class="language-option"
        :class="{ active: lang.code === locale }"
        @click="changeLanguage(lang.code)"
      >
        <span class="language-flag">{{ lang.flag }}</span>
        <span class="language-name">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-button:hover {
  border-color: var(--primary-color);
}

.language-flag {
  font-size: 1.2rem;
}

.dropdown-icon {
  transition: transform 0.2s ease;
}

.dropdown-open {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 150px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
  z-index: 100;
  overflow: hidden;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  background: var(--bg-primary);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.language-option:hover {
  background: var(--bg-secondary);
}

.language-option.active {
  background: var(--bg-secondary);
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .language-name {
    display: none;
  }

  .language-button {
    padding: 0.5rem;
  }
}
</style>

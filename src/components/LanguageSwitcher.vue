<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { setLanguage } from "../i18n";

const { locale } = useI18n();

const languages = [
  { code: "zh-CN", name: "中文" },
  { code: "en-US", name: "English" },
];

const currentLanguage = computed(() => locale);

const switchLanguage = (lang) => {
  setLanguage(lang);
};
</script>

<template>
  <div class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang.code"
      @click="switchLanguage(lang.code)"
      :class="{ active: currentLanguage === lang.code }"
      class="lang-btn"
    >
      {{ lang.name }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-secondary-text);
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  white-space: nowrap;
  font-weight: 500;
}

.lang-btn:hover {
  color: var(--color-text);
  background: var(--color-tertiary-background);
}

.lang-btn.active {
  color: white;
  background: var(--color-primary-gradient);
  border-color: transparent;
}

/* 移动端样式 */
@media (max-width: 1024px) {
  .language-switcher {
    width: 100%;
    justify-content: stretch;
  }

  .lang-btn {
    flex: 1;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lang-btn:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .lang-btn.active {
    background: var(--color-primary-gradient);
    border-color: transparent;
    color: white;
  }
}

/* 桌面端样式 */
@media (min-width: 1025px) {
  .language-switcher {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-lg);
    padding: 0.25rem;
  }

  .lang-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .dark-theme .language-switcher {
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>

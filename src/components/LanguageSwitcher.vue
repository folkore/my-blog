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
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-secondary-text);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.lang-btn:hover {
  color: var(--color-text);
  background: var(--color-tertiary-background);
}

.lang-btn.active {
  color: white;
  background: var(--color-primary-gradient);
}
</style>

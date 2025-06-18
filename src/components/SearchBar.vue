<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  placeholder: {
    type: String,
    default: "搜索文章...",
  },
  searchQuery: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:searchQuery"]);
const { t } = useI18n();

const localQuery = computed({
  get: () => props.searchQuery,
  set: (val) => emit("update:searchQuery", val),
});

const clearSearch = () => {
  emit("update:searchQuery", "");
};
</script>

<template>
  <div class="search-container">
    <div class="search-bar">
      <input
        v-model="localQuery"
        type="text"
        :placeholder="t('search.placeholder')"
        class="search-input"
      />
      <button
        v-if="localQuery"
        class="clear-button"
        @click="clearSearch"
        :aria-label="t('search.clear')"
      >
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
      <div class="search-button-static" :aria-label="t('search.label')">
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
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  width: 100%;
  margin-bottom: 1.5rem;
  max-width: var(--content-width);
  margin: 0 auto;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

.search-bar input {
  width: 100%;
  min-width: 0;
  padding: 0.8rem 3rem 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.search-button-static,
.clear-button {
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.clear-button:hover {
  color: var(--primary-color);
}

.search-button-static {
  right: 0;
  pointer-events: none; /* 放大镜图标不响应点击 */
}

.clear-button {
  right: 2rem;
}
</style>

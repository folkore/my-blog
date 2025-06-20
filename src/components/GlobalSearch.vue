<script setup>
import { ref, watch, onMounted, onUnmounted, computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSearch } from "../composables/useSearch";

const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
  hideButton: {
    type: Boolean,
    default: false,
  },
});

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();

const isOpen = ref(false);
const searchInput = ref(null);
const activeIndex = ref(-1);

// 使用搜索 composable
const {
  searchQuery,
  searchResults,
  isSearching,
  isSearchComplete,
  performSearch,
  clearSearch,
} = useSearch();

const placeholderText = computed(() => t("search.placeholder"));

// 搜索结果处理为高亮格式
const highlightedResults = computed(() => {
  return searchResults.value.map((result, index) => ({
    ...result,
    formattedDate: formatDate(result.date),
  }));
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale.value, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const openSearch = () => {
  isOpen.value = true;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const closeSearch = () => {
  isOpen.value = false;
  searchQuery.value = "";
  activeIndex.value = -1;
  clearSearch();
};

watch(isOpen, (val) => {
  if (val) {
    document.body.style.overflow = "hidden";
    nextTick(() => searchInput.value?.focus());
  } else {
    document.body.style.overflow = "";
  }
});

watch(searchQuery, () => {
  activeIndex.value = -1;
  if (searchQuery.value && searchQuery.value.length >= 1) {
    performSearch();
  } else {
    clearSearch();
  }
});

const handleKeydown = (e) => {
  if (e.key === "Escape") {
    closeSearch();
    return;
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (activeIndex.value < searchResults.value.length - 1) {
      activeIndex.value++;
      scrollActiveIntoView();
    }
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (activeIndex.value > 0) {
      activeIndex.value--;
      scrollActiveIntoView();
    }
  }
  if (e.key === "Enter" && activeIndex.value >= 0) {
    e.preventDefault();
    const selectedResult = searchResults.value[activeIndex.value];
    if (selectedResult) handleResultClick(selectedResult);
  }
};

const scrollActiveIntoView = () => {
  nextTick(() => {
    const activeElement = document.querySelector(".search-result-item.active");
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  });
  closeSearch();
};

const handleResultClick = (result) => {
  router.push(`/blog/${result.slug}`);
  isOpen.value = false;
};

const handleGlobalKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    isOpen.value ? closeSearch() : openSearch();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

// 侦听 URL 查询参数的变化，以便在需要时自动打开搜索
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery && !isOpen.value) {
      openSearch();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});

defineExpose({
  openSearch,
  closeSearch,
});
</script>

<template>
  <div class="global-search">
    <button
      v-if="!props.hideButton"
      @click="openSearch"
      class="search-icon"
      :aria-label="t('search.label')"
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
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span class="search-icon-text">{{ t("search.label") }}</span>
      <span class="kbd-shortcut"
        ><kbd>Ctrl</kbd><span>+</span><kbd>K</kbd></span
      >
    </button>

    <Transition name="search-fade">
      <div v-if="isOpen" class="search-overlay" @click="closeSearch">
        <div class="search-modal" @click.stop>
          <div class="search-header">
            <div class="search-input-wrap">
              <svg
                class="search-input-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
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
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                :placeholder="placeholderText"
                class="search-input"
                @keydown="handleKeydown"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="clear-button"
                aria-label="清除搜索"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <span v-if="isSearching" class="search-status-indicator">
                <span class="search-spinner"></span>
              </span>
            </div>
            <button
              @click="closeSearch"
              class="close-button"
              aria-label="关闭搜索"
            >
              <span>ESC</span>
            </button>
          </div>

          <div class="search-content">
            <div v-if="searchResults.length > 0" class="search-results">
              <div
                v-for="(result, index) in highlightedResults"
                :key="result.id || index"
                class="search-result-item"
                :class="{ active: index === activeIndex }"
                @click="handleResultClick(result)"
                @mouseover="activeIndex = index"
              >
                <div class="result-thumb">
                  <img
                    v-if="result.cover"
                    :src="result.cover"
                    alt="thumbnail"
                    class="thumb-img"
                  />
                  <svg
                    v-else
                    class="thumb-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    ></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <div class="result-content">
                  <div
                    class="result-title"
                    v-html="result.highlightedTitle"
                  ></div>
                  <div
                    class="result-meta"
                    v-if="result.formattedDate || result.tags?.length"
                  >
                    <span v-if="result.formattedDate" class="result-date">{{
                      result.formattedDate
                    }}</span>
                    <span
                      v-if="result.formattedDate && result.tags?.length"
                      class="dot"
                      >·</span
                    >
                    <span
                      v-for="tag in (result.tags || []).slice(0, 3)"
                      :key="tag"
                      class="result-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <div
                    v-if="result.preview"
                    class="result-excerpt"
                    v-html="result.preview"
                  ></div>
                </div>
              </div>
            </div>
            <div
              v-else-if="
                searchQuery && isSearchComplete && !searchResults.length
              "
              class="no-results"
            >
              <p>{{ t("search.empty") }}: "{{ searchQuery }}"</p>
            </div>
            <div v-else-if="isSearching" class="search-loading">
              <div class="search-spinner large"></div>
              <p>{{ t("search.searching") }}</p>
            </div>
            <div v-else class="search-tips">
              <p>{{ t("search.tip") }}</p>
            </div>
          </div>

          <div class="search-footer">
            <div class="keyboard-shortcuts">
              <div class="shortcut">
                <span class="shortcut-key">↑↓</span>
                <span class="shortcut-desc">{{
                  t("search.shortcut.navigate")
                }}</span>
              </div>
              <div class="shortcut">
                <span class="shortcut-key">Enter</span>
                <span class="shortcut-desc">{{
                  t("search.shortcut.select")
                }}</span>
              </div>
              <div class="shortcut">
                <span class="shortcut-key">Esc</span>
                <span class="shortcut-desc">{{
                  t("search.shortcut.close")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.global-search {
  position: relative;
  z-index: 9999;
}

.search-icon {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  background-color: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.search-icon:hover {
  background-color: var(--color-glass-background);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.search-icon-text {
  margin: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.kbd-shortcut {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-tertiary-text);
}

.kbd-shortcut kbd {
  background: var(--color-glass-background);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  padding: 0.1rem 0.3rem;
  font-size: 0.75rem;
  line-height: 1;
  margin: 0 0.15rem;
}

/* 全屏搜索样式 */
.search-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.search-modal {
  width: 100%;
  max-width: 700px;
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2rem);
  max-height: 800px;
  position: relative;
  overflow: hidden;
  animation: modalEnter 0.3s var(--bezier-bounce);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.search-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-tertiary-background);
  border-radius: var(--radius-lg);
  padding: 0.75rem 1.25rem;
  transition: all 0.2s ease;
  flex: 1;
  position: relative;
}

.search-input-wrap:focus-within {
  background: var(--color-secondary-background);
  box-shadow: var(--shadow-sm);
}

.search-input-icon {
  color: var(--color-secondary-text);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  font-size: 1.25rem;
  color: var(--color-text);
  padding: 0;
  min-width: 0;
}

.search-input:focus {
  outline: none;
}

.clear-button {
  background: none;
  border: none;
  padding: 0.25rem;
  color: var(--color-tertiary-text);
  cursor: pointer;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: var(--color-text);
  background: var(--color-tertiary-background);
}

.close-button {
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-md);
  background: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--color-secondary-background);
  color: var(--color-text);
}

/* 搜索状态指示器 */
.search-status-indicator {
  display: flex;
  align-items: center;
}

.search-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(var(--color-primary-rgb), 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.search-spinner.large {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 搜索结果 */
.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  position: relative;
}

.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--color-secondary-text);
  gap: 1rem;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.search-result-item {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--color-tertiary-background);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.search-result-item:hover,
.search-result-item.active {
  background: var(--color-secondary-background);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
  border-color: var(--color-border);
}

.result-thumb {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-tertiary-background);
  color: var(--color-secondary-text);
}

.thumb-img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.thumb-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.result-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-title {
  font-weight: 600;
  color: var(--color-text);
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-secondary-text);
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
}

.result-date {
  white-space: nowrap;
}

.result-tag {
  background: var(--color-primary-gradient);
  color: #fff;
  padding: 0 6px;
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  line-height: 1.5;
}

.dot {
  opacity: 0.6;
}

.result-excerpt {
  color: var(--color-secondary-text);
  font-size: 0.875rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: break-word;
  word-break: break-word;
}

.no-results,
.search-tips {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--color-secondary-text);
}

/* 搜索页脚 */
.search-footer {
  padding: 1rem 1.5rem;
  background: var(--color-tertiary-background);
  border-top: 1px solid var(--color-border);
  position: sticky;
  bottom: 0;
  z-index: 2;
}

.keyboard-shortcuts {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.shortcut {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shortcut-key {
  padding: 0.25rem 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-secondary-text);
  min-width: 1.5rem;
  text-align: center;
}

.shortcut-desc {
  font-size: 0.875rem;
  color: var(--color-secondary-text);
  white-space: nowrap;
}

/* 动画效果 */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.3s ease;
}

.search-fade-enter-active .search-modal,
.search-fade-leave-active .search-modal {
  transition: transform 0.3s var(--bezier-bounce);
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-fade-enter-from .search-modal,
.search-fade-leave-to .search-modal {
  transform: scale(0.95) translateY(-20px);
}

@media (max-width: 768px) {
  .search-overlay {
    padding: 0.5rem;
  }

  .search-modal {
    height: calc(100vh - 1rem);
    max-height: none;
  }

  .search-header {
    padding: 1rem;
  }

  .search-input-wrap {
    padding: 0.5rem 1rem;
  }

  .search-input {
    font-size: 1rem;
  }

  .search-content {
    padding: 0.75rem 1rem;
  }

  .search-result-item {
    padding: 0.75rem 1rem;
  }

  .search-footer {
    padding: 0.75rem 1rem;
  }

  .keyboard-shortcuts {
    gap: 1rem;
  }

  .shortcut-desc {
    font-size: 0.75rem;
  }
}
</style>

<style>
/* 高亮样式 */
.global-search mark,
.highlight {
  background-color: var(--color-primary);
  color: white;
  padding: 0 2px;
  border-radius: var(--radius-sm);
  font-style: normal;
  display: inline;
}

.result-title mark {
  color: white !important;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  padding: 0 2px;
}
</style>

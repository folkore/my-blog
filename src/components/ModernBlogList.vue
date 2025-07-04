<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { usePostsStore } from "../store";
import { useSearch } from "../composables/useSearch";

const { t, locale } = useI18n();
const postsStore = usePostsStore();
const { searchQuery, searchResults, performSearch } = useSearch(true);

// 响应式数据
const isLoading = ref(false);
const selectedTags = ref([]);
const showTagDropdown = ref(false);
const tagDropdownRef = ref(null);
const postsPerPage = 8;
const postsShown = ref(postsPerPage);
const forceUpdate = ref(false);
const searchInputRef = ref(null);

// 获取博客文章
const blogPosts = computed(() => {
  return postsStore.posts || [];
});

// 根据搜索和标签筛选文章
const finalFilteredPosts = computed(() => {
  let posts = [];

  // 如果有搜索输入，则以包含高亮信息的搜索结果为基础
  if (searchQuery.value) {
    posts = searchResults.value;

    // 如果同时选择了标签，则在搜索结果上再次筛选
    if (selectedTags.value.length > 0) {
      posts = posts.filter((post) =>
        post.tags.some((tag) => selectedTags.value.includes(tag))
      );
    }
  } else {
    // 如果没有搜索，仅按标签筛选
    if (selectedTags.value.length > 0) {
      posts = blogPosts.value.filter((post) =>
        post.tags.some((tag) => selectedTags.value.includes(tag))
      );
    } else {
      posts = blogPosts.value;
    }
  }

  return posts;
});

// 显示的文章列表
const displayedPosts = computed(() => {
  return finalFilteredPosts.value.slice(0, postsShown.value);
});

// 获取所有标签
const allTags = computed(() => {
  const tags = new Set();
  blogPosts.value.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
});

// 搜索处理
const handleSearch = (query) => {
  searchQuery.value = query;
  if (query) {
    performSearch(query);
  }
  postsShown.value = postsPerPage; // 重置显示数量
};

// 标签选择处理
const handleTagSelect = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  postsShown.value = postsPerPage; // 重置显示数量
};

// 清除所有筛选
const clearFilters = () => {
  searchQuery.value = "";
  selectedTags.value = [];
  postsShown.value = postsPerPage;
  showTagDropdown.value = false;
};

// 切换标签下拉菜单
const toggleTagDropdown = () => {
  showTagDropdown.value = !showTagDropdown.value;
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (tagDropdownRef.value && !tagDropdownRef.value.contains(event.target)) {
    showTagDropdown.value = false;
  }
};

// 交叉观察器加载更多
const sentinel = ref(null);
let observer = null;

const loadMore = () => {
  if (postsShown.value < finalFilteredPosts.value.length) {
    postsShown.value += postsPerPage;
  }
};

// 监听标签下拉菜单状态，控制body滚动
watch(showTagDropdown, (newValue) => {
  if (newValue) {
    // 打开弹出层时禁用body滚动
    document.body.style.overflow = "hidden";
  } else {
    // 关闭弹出层时恢复body滚动
    document.body.style.overflow = "";
  }
});

// 初始化
onMounted(async () => {
  isLoading.value = true;

  try {
    // 文章数据已经在 store 初始化时加载，这里只需要模拟加载过程
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    console.error("Failed to load posts:", error);
  } finally {
    isLoading.value = false;
  }

  // 设置交叉观察器
  await nextTick();
  if (sentinel.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel.value);
  }

  // 添加点击外部关闭下拉菜单的事件监听
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  // 移除事件监听器
  document.removeEventListener("click", handleClickOutside);
  // 确保恢复body滚动
  document.body.style.overflow = "";
});

// 监听语言变化
watch(locale, () => {
  forceUpdate.value = !forceUpdate.value;
});
</script>

<template>
  <div class="modern-blog-list">
    <!-- 背景装饰 -->
    <div class="background-decoration"></div>

    <!-- 页面头部 -->
    <header class="blog-header">
      <div class="container">
        <h1 class="blog-title">{{ t("blog.title", "文章列表") }}</h1>
        <p class="blog-subtitle">
          {{ t("blog.subtitle", "探索知识的海洋，分享思想的火花") }}
        </p>
      </div>
    </header>

    <!-- 搜索和筛选区域 -->
    <section class="search-filter-section">
      <div class="container">
        <!-- 搜索栏 -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg
              class="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              ref="searchInputRef"
              type="text"
              :placeholder="t('blog.searchPlaceholder', '搜索文章...')"
              :value="searchQuery"
              @input="handleSearch($event.target.value)"
              class="search-input"
            />
            <button
              v-if="searchQuery"
              @click="handleSearch('')"
              class="clear-search"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- 标签筛选弹出层 -->
        <div class="tags-filter">
          <div class="tag-filter-container" ref="tagDropdownRef">
            <button
              @click="toggleTagDropdown"
              class="tag-filter-button"
              :class="{ active: showTagDropdown }"
            >
              <svg
                class="tag-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"
                ></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span>
                {{
                  selectedTags.length > 0
                    ? `${t("blog.tagsFilter", "标签筛选")} (${selectedTags.length})`
                    : t("blog.tagsFilter", "标签筛选")
                }}
              </span>
              <svg
                class="filter-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- 移动端遮罩层 -->
            <div
              v-if="showTagDropdown"
              class="tag-popup-overlay"
              @click="showTagDropdown = false"
            ></div>

            <!-- 标签弹出层 -->
            <div v-if="showTagDropdown" class="tag-popup-layer">
              <div class="tag-popup-header">
                <h3>{{ t("blog.selectTags", "选择标签") }}</h3>
                <div class="header-actions">
                  <button
                    v-if="selectedTags.length > 0"
                    @click="selectedTags = []"
                    class="clear-all-tags"
                  >
                    {{ t("blog.clearAll", "清除全部") }}
                  </button>
                  <button
                    @click="showTagDropdown = false"
                    class="close-popup"
                    aria-label="关闭"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="tag-popup-content">
                <div class="tag-grid">
                  <button
                    v-for="tag in allTags"
                    :key="tag"
                    @click="handleTagSelect(tag)"
                    :class="[
                      'tag-item',
                      { selected: selectedTags.includes(tag) },
                    ]"
                  >
                    <span class="tag-name">{{ tag }}</span>
                    <span class="tag-count">
                      {{
                        blogPosts.filter((post) => post.tags.includes(tag))
                          .length
                      }}
                    </span>
                  </button>
                </div>
              </div>

              <div class="tag-popup-footer">
                <button @click="showTagDropdown = false" class="apply-filters">
                  {{ t("blog.applyFilters", "应用筛选") }}
                </button>
              </div>
            </div>
          </div>

          <button
            v-if="selectedTags.length > 0 || searchQuery"
            @click="clearFilters"
            class="clear-filters"
          >
            {{ t("blog.clearFilters", "清除筛选") }}
          </button>
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <main class="articles-section">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">{{ t("blog.loading", "加载中...") }}</p>
        </div>

        <!-- 无结果提示 -->
        <div v-else-if="finalFilteredPosts.length === 0" class="no-results">
          <div class="no-results-icon">📝</div>
          <h3 class="no-results-title">
            {{ t("blog.noResults", "暂无文章") }}
          </h3>
          <p class="no-results-text">
            {{
              t(
                "blog.noResultsDesc",
                "没有找到符合条件的文章，试试其他关键词吧"
              )
            }}
          </p>
        </div>

        <!-- 文章网格 -->
        <div v-else class="articles-grid">
          <article
            v-for="(post, index) in displayedPosts"
            :key="post.id"
            class="article-card"
            :style="{ '--animation-delay': index * 0.1 + 's' }"
          >
            <router-link :to="`/blog/${post.slug}`" class="card-link">
              <!-- 文章内容 -->
              <div class="card-content">
                <header class="card-header">
                  <h2
                    class="card-title"
                    v-html="post.highlightedTitle || post.title"
                  ></h2>
                  <div class="card-tags">
                    <span
                      v-for="(tag, tagIndex) in post.tags.slice(0, 3)"
                      :key="tagIndex"
                      class="card-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </header>

                <p
                  class="card-excerpt"
                  v-html="post.preview || post.excerpt"
                ></p>

                <footer class="card-footer">
                  <time class="card-date">{{
                    new Date(post.date).toLocaleDateString("zh-CN")
                  }}</time>
                  <div class="card-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </footer>
              </div>

              <!-- 文章图片 -->
              <div class="card-image-wrapper">
                <div class="card-image">
                  <img v-lazy="post.cover" :alt="post.title" />
                </div>
              </div>
            </router-link>
          </article>
        </div>

        <!-- 加载更多触发器 -->
        <div ref="sentinel" class="load-more-sentinel"></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 基础布局 */
.modern-blog-list {
  position: relative;
  min-height: 100vh;
  background: var(--color-background, #ffffff);

  /* 确保必要的CSS变量有默认值 */
  --color-shadow: rgba(0, 0, 0, 0.08);
  --color-shadow-lg: rgba(0, 0, 0, 0.15);
  --color-primary-gradient: linear-gradient(135deg, #0066ff, #3385ff);
  --color-danger: #ef4444;
}

.dark-theme .modern-blog-list {
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-shadow-lg: rgba(0, 0, 0, 0.4);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 背景装饰 */
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    rgba(var(--color-primary-rgb), 0.02) 100%
  );
  z-index: -1;
}

/* 页面头部 */
.blog-header {
  padding: 6rem 0 4rem;
  text-align: center;
}

.blog-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.blog-subtitle {
  font-size: 1.125rem;
  color: var(--color-secondary-text);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 搜索和筛选区域 */
.search-filter-section {
  padding: 0 0 4rem;
}

.search-container {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--color-secondary-text);
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid transparent;
  border-radius: 16px;
  background: var(--color-glass-background);
  backdrop-filter: blur(20px) saturate(120%);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px var(--color-shadow);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow:
    0 8px 32px var(--color-shadow),
    0 0 0 4px rgba(var(--color-primary-rgb), 0.1);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: var(--color-secondary-text);
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-search:hover {
  color: var(--color-text);
}

.clear-search svg {
  width: 100%;
  height: 100%;
}

/* 标签筛选弹出层 */
.tags-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tag-filter-container {
  position: relative;
}

.tag-filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
  border-radius: 16px;
  background: var(--color-glass-background);
  backdrop-filter: blur(20px) saturate(120%);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 140px;
  justify-content: space-between;
}

.tag-filter-button:hover {
  background: rgba(var(--color-primary-rgb), 0.05);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--color-primary-rgb), 0.15);
}

.tag-filter-button.active {
  border-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb), 0.1);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.tag-icon {
  width: 16px;
  height: 16px;
  color: var(--color-primary);
}

.filter-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.tag-filter-button.active .filter-arrow {
  transform: rotate(180deg);
}

/* 移动端遮罩层 */
.tag-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: none;
  animation: overlayFadeIn 0.3s ease;
  touch-action: none;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes mobilePopupFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 标签弹出层 */
.tag-popup-layer {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 400px;
  max-width: 600px;
  width: max-content;
  background: var(--color-glass-background);
  backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  box-shadow: 0 16px 48px var(--color-shadow);
  z-index: 1000;
  overflow: hidden;
  animation: popupFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-12px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

.tag-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: rgba(var(--color-primary-rgb), 0.02);
}

.tag-popup-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.clear-all-tags {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 10px;
  background: rgba(var(--color-danger), 0.1);
  color: var(--color-danger);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-tags:hover {
  background: var(--color-danger);
  color: white;
  transform: translateY(-1px);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-popup {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: rgba(var(--color-text-rgb), 0.1);
  border: 1px solid rgba(var(--color-text-rgb), 0.2);
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.close-popup svg {
  width: 16px;
  height: 16px;
}

.close-popup:hover {
  background: rgba(var(--color-text-rgb), 0.15);
  border-color: rgba(var(--color-text-rgb), 0.3);
  transform: translateY(-1px);
}

.tag-popup-content {
  padding: 1.5rem;
  max-height: 280px;
  overflow-y: auto;
}

.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.tag-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
  border-radius: 12px;
  background: rgba(var(--color-primary-rgb), 0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: 0.875rem;
  text-align: center;
  min-height: 70px;
  gap: 0.25rem;
}

.tag-item:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
  border-color: rgba(var(--color-primary-rgb), 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.15);
}

.tag-item.selected {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

.tag-item.selected .tag-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.tag-name {
  font-weight: 500;
  color: inherit;
  font-size: 0.8rem;
  line-height: 1.2;
  word-break: break-word;
}

.tag-count {
  background: rgba(var(--color-primary-rgb), 0.15);
  color: var(--color-primary);
  padding: 0.125rem 0.375rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

.tag-popup-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
  background: rgba(var(--color-primary-rgb), 0.02);
}

.apply-filters {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 12px;
  background: var(--color-primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-filters:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

.clear-filters {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-glass-background);
  color: var(--color-secondary-text);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.clear-filters:hover {
  background: var(--color-danger);
  color: white;
  border-color: var(--color-danger);
}

/* 文章列表区域 */
.articles-section {
  padding: 0 0 6rem;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--color-secondary-text);
  font-size: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 无结果状态 */
.no-results {
  text-align: center;
  padding: 4rem 0;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-results-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.no-results-text {
  color: var(--color-secondary-text);
  font-size: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

/* 文章网格 */
.articles-grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* 文章卡片 - 优化的细腻动画 */
.article-card {
  opacity: 0;
  transform: translateY(40px) scale(0.92) rotateX(8deg);
  animation: smoothFadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: var(--animation-delay);
  transform-origin: center bottom;
  will-change: transform, opacity;
}

@keyframes smoothFadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.92) rotateX(8deg);
  }
  60% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.02) rotateX(-1deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}

.card-link {
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 0;
  text-decoration: none;
  color: inherit;
  background: var(--color-glass-background);
  backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 8px 32px var(--color-shadow);
  transform-origin: center;
  will-change: transform, box-shadow, border-color;
}

.card-link::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.05) 0%,
    rgba(var(--color-primary-rgb), 0.02) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: inherit;
}

.card-link:hover {
  transform: translateY(-12px) scale(1.03) rotateX(2deg);
  box-shadow:
    0 25px 80px var(--color-shadow-lg),
    0 12px 32px rgba(var(--color-primary-rgb), 0.2),
    0 0 0 1px rgba(var(--color-primary-rgb), 0.1);
  border-color: rgba(var(--color-primary-rgb), 0.4);
}

.card-link:hover::before {
  opacity: 1;
}

/* 卡片内容 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
  position: relative;
  z-index: 2;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  margin: 0;
  will-change: transform, color;
}

.card-link:hover .card-title {
  color: var(--color-primary);
  transform: translateX(6px) translateY(-1px);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  border: 1px solid rgba(var(--color-primary-rgb), 0.2);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, background-color, border-color;
}

.card-link:hover .card-tag {
  background: rgba(var(--color-primary-rgb), 0.2);
  border-color: rgba(var(--color-primary-rgb), 0.4);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 8px rgba(var(--color-primary-rgb), 0.15);
}

.card-excerpt {
  color: var(--color-secondary-text);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.card-link:hover .card-excerpt {
  color: var(--color-text);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.card-date {
  color: var(--color-secondary-text);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  font-weight: 500;
  transition: color 0.3s ease;
}

.card-link:hover .card-date {
  color: var(--color-primary);
}

.card-arrow {
  color: var(--color-primary);
  opacity: 0;
  transform: translateX(-10px) scale(0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(var(--color-primary-rgb), 0.1);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-arrow svg {
  width: 16px;
  height: 16px;
}

.card-link:hover .card-arrow {
  opacity: 1;
  transform: translateX(0) scale(1);
  background: rgba(var(--color-primary-rgb), 0.2);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.25);
}

/* 卡片图片 */
.card-image-wrapper {
  width: 280px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: brightness(0.9) saturate(1.1);
  will-change: transform, filter;
}

.card-link:hover .card-image img {
  transform: scale(1.15) rotate(1deg);
  filter: brightness(1.05) saturate(1.3) contrast(1.1);
}

/* 加载更多触发器 */
.load-more-sentinel {
  height: 1px;
  margin-top: 2rem;
}

/* 深色主题适配 */
.dark-theme .card-link:hover {
  background: var(--color-glass-background-dark);
}

.dark-theme .card-tag {
  background: rgba(var(--color-primary-rgb), 0.15);
  border-color: rgba(var(--color-primary-rgb), 0.25);
  color: var(--color-primary-light);
}

.dark-theme .card-link:hover .card-tag {
  background: rgba(var(--color-primary-rgb), 0.25);
  border-color: rgba(var(--color-primary-rgb), 0.5);
}

.dark-theme .card-arrow {
  background: rgba(var(--color-primary-rgb), 0.15);
  color: var(--color-primary-light);
}

.dark-theme .card-link:hover .card-arrow {
  background: rgba(var(--color-primary-rgb), 0.25);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

/* 深色主题弹出层适配 */
.dark-theme .tag-popup-layer {
  background: var(--color-glass-background-dark);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

.dark-theme .tag-popup-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.dark-theme .tag-popup-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
  background: rgba(var(--color-primary-rgb), 0.05);
}

.dark-theme .tag-item {
  background: rgba(var(--color-primary-rgb), 0.08);
  border-color: rgba(var(--color-primary-rgb), 0.25);
}

.dark-theme .tag-item:hover {
  background: rgba(var(--color-primary-rgb), 0.15);
  border-color: rgba(var(--color-primary-rgb), 0.4);
}

.dark-theme .tag-count {
  background: rgba(var(--color-primary-rgb), 0.2);
  color: var(--color-primary-light);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .articles-grid {
    gap: 1.5rem;
  }

  .card-content {
    padding: 2rem;
  }

  .card-image-wrapper {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .blog-header {
    padding: 4rem 0 3rem;
  }

  .blog-title {
    font-size: 2.5rem;
  }

  .search-filter-section {
    padding: 0 0 3rem;
  }

  .search-input-wrapper {
    max-width: 100%;
  }

  .tags-filter {
    flex-direction: column;
    gap: 1rem;
  }

  .tag-filter-button {
    min-width: 100%;
    justify-content: space-between;
  }

  .tag-popup-overlay {
    display: block;
  }

  .tag-popup-layer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
    width: auto;
    max-height: 70vh;
    overflow: hidden;
    z-index: 1000;
    animation: mobilePopupFadeIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .close-popup {
    display: flex;
  }

  .tag-popup-content {
    max-height: calc(70vh - 80px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .tag-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
    padding: 0.5rem;
  }

  .tag-item {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
    min-height: 70px;
    border-radius: 10px;
  }

  .tag-name {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    word-break: break-word;
  }

  .tag-count {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    margin-top: 0.25rem;
  }

  .card-link {
    flex-direction: column;
    gap: 0;
    border-radius: 16px;
  }

  .card-content {
    width: 100%;
    padding: 2rem;
  }

  .card-image-wrapper {
    width: 100%;
    height: 200px;
    order: -1;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-arrow {
    position: static;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .blog-title {
    font-size: 2rem;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .card-image-wrapper {
    height: 160px;
  }

  .tag-popup-layer {
    min-width: calc(100vw - 1rem);
    max-width: calc(100vw - 1rem);
    max-height: 80vh;
  }

  .tag-popup-content {
    max-height: calc(80vh - 80px);
  }

  .tag-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 0.5rem;
    padding: 0.25rem;
  }

  .tag-item {
    padding: 0.6rem 0.4rem;
    min-height: 65px;
    font-size: 0.75rem;
  }

  .tag-name {
    font-size: 0.75rem;
    line-height: 1.1;
  }

  .tag-count {
    font-size: 0.65rem;
    padding: 0.1rem 0.3rem;
  }
}

/* 中等屏幕优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .tag-popup-layer {
    min-width: 500px;
    max-width: 700px;
  }

  .tag-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}

/* 大屏幕优化 */
@media (min-width: 1025px) {
  .tag-popup-layer {
    min-width: 500px;
    max-width: 800px;
  }

  .tag-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import SearchBar from "../components/SearchBar.vue";
import TagFilter from "../components/TagFilter.vue";
import { usePostsStore } from "../store";
import { useSearch } from "../composables/useSearch";

const { t, locale } = useI18n();
const postsStore = usePostsStore();
const { searchQuery, searchResults, performSearch } = useSearch(true);

// 监听语言变化事件
const handleLanguageChanged = () => {
  // 强制组件重新渲染
  forceUpdate.value = !forceUpdate.value;
};

// 用于强制组件重新渲染的标志
const forceUpdate = ref(false);

// 监听语言变化
watch(locale, () => {
  // 强制组件重新渲染
  forceUpdate.value = !forceUpdate.value;
});

// 从 store 获取博客文章
const blogPosts = computed(() => postsStore.posts);

// 在实际应用中，这里应该是从 API 获取博客文章
const isLoading = ref(false);

onMounted(() => {
  // 添加语言变化事件监听
  window.addEventListener("language-changed", handleLanguageChanged);

  // 模拟加载
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  });
  nextTick(() => {
    if (sentinel.value) observer.observe(sentinel.value);
  });
});

onUnmounted(() => {
  // 移除语言变化事件监听
  window.removeEventListener("language-changed", handleLanguageChanged);
  if (observer && sentinel.value) observer.unobserve(sentinel.value);
});

// 搜索和筛选
const selectedTags = ref([]);
const postsPerPage = 6;
const postsShown = ref(postsPerPage);

// 当搜索或标签筛选变化时重置计数
watch([searchQuery, selectedTags], () => {
  postsShown.value = postsPerPage;
});

// 监听搜索框输入，执行搜索
watch(searchQuery, (newQuery) => {
  performSearch();
});

// 计算需要展示的文章列表
const displayedPosts = computed(() =>
  finalFilteredPosts.value.slice(0, postsShown.value)
);

// 交叉观察器加载更多
const sentinel = ref(null);
let observer = null;

const loadMore = () => {
  if (postsShown.value < finalFilteredPosts.value.length) {
    postsShown.value += postsPerPage;
  }
};

// 获取所有标签
const allTags = computed(() => {
  const tags = new Set();
  blogPosts.value.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
});

// 根据搜索和标签筛选文章
const finalFilteredPosts = computed(() => {
  // 如果有搜索输入，则以包含高亮信息的搜索结果为基础
  if (searchQuery.value) {
    let results = searchResults.value;

    // 如果同时选择了标签，则在搜索结果上再次筛选
    if (selectedTags.value.length > 0) {
      results = results.filter((post) =>
        post.tags.some((tag) => selectedTags.value.includes(tag))
      );
    }
    return results;
  }

  // 如果没有搜索，仅按标签筛选
  if (selectedTags.value.length > 0) {
    return blogPosts.value.filter((post) =>
      post.tags.some((tag) => selectedTags.value.includes(tag))
    );
  }

  // 如果没有搜索也没有标签筛选，返回所有文章
  return blogPosts.value;
});

// 处理搜索
const handleSearch = (query) => {
  searchQuery.value = query;
};

// 标签筛选面板状态
const isFilterPanelOpen = ref(false);

// 打开 / 关闭面板
const toggleFilterPanel = () => {
  isFilterPanelOpen.value = !isFilterPanelOpen.value;
};
const closeFilterPanel = () => {
  isFilterPanelOpen.value = false;
};

// 选择标签后自动关闭面板（可根据需要保留注释）
watch(selectedTags, (val, oldVal) => {
  // 当选择发生变化且面板打开时自动关闭以节省空间
  if (isFilterPanelOpen.value) {
    closeFilterPanel();
  }
});
</script>

<template>
  <div class="blog">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">{{ t("blog.title") }}</h1>
        <p class="page-description">{{ t("blog.description") }}</p>
      </div>
      <div class="header-background">
        <div class="header-shape-1"></div>
        <div class="header-shape-2"></div>
      </div>
    </header>

    <!-- 文章筛选器 -->
    <section class="filter-section">
      <div class="container">
        <div class="filters">
          <!-- 搜索框组件 -->
          <SearchBar
            :placeholder="t('search.placeholder')"
            v-model:searchQuery="searchQuery"
          />

          <!-- 标签筛选按钮 -->
          <button class="filter-button" @click="toggleFilterPanel">
            {{ t("filter.tags.title") }}
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
              <path
                d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1l-7 9v6l-4 3v-9L3 4z"
              />
            </svg>
          </button>

          <!-- 标签筛选组件（可折叠） -->
          <!-- <TagFilter
            v-if="isFilterPanelOpen"
            :tags="allTags"
            v-model:selectedTags="selectedTags"
          /> -->
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="posts-section">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ t("blog.loading") }}</p>
        </div>

        <!-- 无结果提示 -->
        <div v-else-if="finalFilteredPosts.length === 0" class="no-results">
          <p>{{ t("blog.noResults") }}</p>
        </div>

        <!-- 文章列表 -->
        <div v-else class="posts-grid">
          <article
            v-for="post in displayedPosts"
            :key="post.id"
            class="post-card"
          >
            <div class="post-image">
              <img v-lazy="post.cover" :alt="post.title" />
            </div>
            <div class="post-content">
              <div class="post-tags">
                <span
                  v-for="(tag, index) in post.tags"
                  :key="index"
                  class="post-tag"
                >
                  {{ tag }}
                </span>
              </div>
              <h2
                class="post-title"
                v-html="post.highlightedTitle || post.title"
              ></h2>
              <p class="post-excerpt" v-html="post.preview || post.excerpt"></p>
              <div class="post-meta">
                <div class="meta-left">
                  <span class="post-date">{{ post.date }}</span>
                </div>
                <router-link :to="`/blog/${post.slug}`" class="post-link">
                  {{ t("blog.readMore") }}
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
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <!-- Sentinel 元素，用于触发加载更多 -->
        <div ref="sentinel" style="height: 1px"></div>
      </div>
    </section>

    <!-- 筛选面板 Drawer -->
    <transition name="overlay-fade">
      <div
        v-if="isFilterPanelOpen"
        class="filter-overlay"
        @click.self="closeFilterPanel"
      >
        <!-- 抽屉面板过渡 -->
        <transition name="drawer">
          <div class="filter-panel" v-show="isFilterPanelOpen">
            <div class="filter-panel-header">
              <h3>{{ t("filter.tags.title") }}</h3>
              <button class="close-panel" @click="closeFilterPanel">
                &times;
              </button>
            </div>
            <TagFilter :tags="allTags" v-model:selectedTags="selectedTags" />

            <!-- 移动端底部关闭按钮 -->
            <div class="panel-footer-mobile">
              <button class="btn-close-mobile" @click="closeFilterPanel">
                {{ t("search.close") }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.container {
  max-width: var(--content-width);
  width: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

.blog {
  min-height: 100vh;
  max-width: var(--content-width);
  margin: 0 auto;
  overflow-x: hidden;
  padding: 0 24px;
}

/* 页面头部 */
.page-header {
  position: relative;
  padding: 3rem 0;
  background: var(--bg-secondary);
  overflow: hidden;
  width: 100%;
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  background: linear-gradient(
    120deg,
    var(--text-primary),
    var(--primary-color)
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.header-shape-1,
.header-shape-2 {
  position: absolute;
  border-radius: 50%;
  filter: blur(30px);
}

.header-shape-1 {
  width: 400px;
  height: 400px;
  background: var(--primary-color);
  opacity: 0.1;
  top: -200px;
  right: -100px;
}

.header-shape-2 {
  width: 300px;
  height: 300px;
  background: var(--primary-hover);
  opacity: 0.1;
  bottom: -150px;
  left: -50px;
}

/* 筛选器区域 */
.filter-section {
  padding: 1.5rem 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.2s ease;
}

.filter-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(var(--bg-primary-rgb), 0.8),
    rgba(var(--bg-primary-rgb), 0.6)
  );
  z-index: -1;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
}

/* 文章列表 */
.posts-section {
  padding: 3rem 0;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
  font-size: 0.9375rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.post-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.post-image {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
  background: var(--bg-secondary);
}

.post-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image img {
  transform: scale(1.03);
}

.post-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.post-tag {
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.post-excerpt {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.post-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.post-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.post-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--primary-color);
  font-weight: 500;
  transition: all 0.2s ease;
}

.post-link:hover {
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .filter-section {
    padding: 1rem 16px;
  }

  .filters {
    gap: 1rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .post-content {
    padding: 1rem;
  }

  .post-title {
    font-size: 1rem;
  }

  .post-excerpt {
    font-size: 0.8125rem;
  }
}

@media (min-width: 1200px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tag-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
  max-width: var(--content-width);
  margin: 0 auto;
  width: 100%;
}

.tag-button {
  width: 100%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.9rem;
  border-radius: 30px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  max-width: 100%;
  min-height: 2.2rem;
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .filter-section::before {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.8),
      rgba(0, 0, 0, 0.6)
    );
  }

  .post-card {
    background: rgba(255, 255, 255, 0.02);
  }

  .post-card:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  .post-tag {
    background: rgba(255, 255, 255, 0.06);
  }
}

/* 动画效果 */
.post-card {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-button {
  white-space: nowrap;
  min-width: 110px;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    135deg,
    var(--primary-color) 0%,
    var(--primary-hover) 100%
  );
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.25);
  transition:
    transform 0.2s var(--bezier-smooth),
    box-shadow 0.2s;
}
.filter-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--color-primary-rgb), 0.35);
}
.dark-theme .filter-button {
  background: linear-gradient(
    135deg,
    var(--primary-hover) 0%,
    var(--primary-color) 100%
  );
}

.filter-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem 1rem;
  z-index: 1000;
}

.filter-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 360px;
  background: var(--bg-primary);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}

.filter-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.close-panel {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--text-secondary);
}

.close-panel:hover {
  color: var(--primary-color);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Drawer 过渡（桌面：右侧滑入；移动端：底部滑入） */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.35s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

/* 移动端覆盖，抽屉自底部滑入 */
@media (max-width: 768px) {
  .drawer-enter-from,
  .drawer-leave-to {
    transform: translateY(100%);
  }
  .filter-panel {
    width: 100%;
    max-width: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    bottom: 0;
    left: 0;
  }
}

@media (min-width: 600px) {
  .filters {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  .filters .search-container {
    flex: 1 1 auto;
    margin-bottom: 0; /* 移除竖向布局下的下边距 */
  }
  .filter-button {
    margin-left: auto;
  }
}

.btn-close-mobile {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary-color);
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-close-mobile:hover {
  background: var(--primary-hover);
}

/* 仅移动端显示底部按钮 */
.panel-footer-mobile {
  display: none;
}
@media (max-width: 768px) {
  .panel-footer-mobile {
    display: block;
    padding: 1rem 1.5rem 1.5rem;
    border-top: 1px solid var(--border-color);
  }
}
</style>

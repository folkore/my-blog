<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useReadingPreferences } from "../composables/useReadingPreferences";
import BookmarkButton from "../components/BookmarkButton.vue";

const router = useRouter();
const { t } = useI18n();
const { getBookmarksList, removeBookmark } = useReadingPreferences();

// 状态管理
const bookmarks = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const selectedCategory = ref("all");
const sortBy = ref("bookmarkedAt"); // 'bookmarkedAt', 'title', 'date'
const sortOrder = ref("desc"); // 'asc', 'desc'

// 分类选项
const categories = computed(() => {
  const allCategories = new Set(["all"]);
  bookmarks.value.forEach((bookmark) => {
    if (bookmark.category) {
      allCategories.add(bookmark.category);
    }
    bookmark.tags?.forEach((tag) => allCategories.add(tag));
  });
  return Array.from(allCategories);
});

// 过滤和排序后的书签
const filteredBookmarks = computed(() => {
  let filtered = bookmarks.value;

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.excerpt.toLowerCase().includes(query) ||
        bookmark.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // 分类过滤
  if (selectedCategory.value !== "all") {
    filtered = filtered.filter(
      (bookmark) =>
        bookmark.category === selectedCategory.value ||
        bookmark.tags?.includes(selectedCategory.value)
    );
  }

  // 排序
  filtered.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy.value) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "date":
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case "bookmarkedAt":
      default:
        aValue = a.bookmarkedAt;
        bValue = b.bookmarkedAt;
        break;
    }

    if (sortOrder.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

// 格式化日期
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 格式化收藏时间
const formatBookmarkTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "今天收藏";
  } else if (days === 1) {
    return "昨天收藏";
  } else if (days < 7) {
    return `${days}天前收藏`;
  } else {
    return formatDate(timestamp) + " 收藏";
  }
};

// 跳转到文章
const goToArticle = (slug) => {
  router.push(`/blog/${slug}`);
};

// 移除书签
const handleRemoveBookmark = (slug) => {
  removeBookmark(slug);
  loadBookmarks();
};

// 清空搜索
const clearSearch = () => {
  searchQuery.value = "";
};

// 加载书签数据
const loadBookmarks = () => {
  isLoading.value = true;
  try {
    bookmarks.value = getBookmarksList();
  } catch (error) {
    console.error("Failed to load bookmarks:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadBookmarks();
});
</script>

<template>
  <div class="bookmarks-page">
    <div class="container">
      <!-- 页面头部 -->
      <header class="page-header">
        <div class="header-content">
          <h1 class="page-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            我的书签
          </h1>
          <p class="page-subtitle">共收藏了 {{ bookmarks.length }} 篇文章</p>
        </div>
      </header>

      <!-- 搜索和筛选 -->
      <div class="filters-section">
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg
              class="search-icon"
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索书签..."
              class="search-input"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="clear-search"
              title="清空搜索"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 筛选和排序 -->
        <div class="filter-controls">
          <!-- 分类筛选 -->
          <select v-model="selectedCategory" class="filter-select">
            <option value="all">全部分类</option>
            <option
              v-for="category in categories.filter((c) => c !== 'all')"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>

          <!-- 排序方式 -->
          <select v-model="sortBy" class="filter-select">
            <option value="bookmarkedAt">收藏时间</option>
            <option value="title">标题</option>
            <option value="date">发布时间</option>
          </select>

          <!-- 排序顺序 -->
          <button
            @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
            class="sort-order-btn"
            :title="sortOrder === 'desc' ? '降序' : '升序'"
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
              :class="{ 'rotate-180': sortOrder === 'asc' }"
            >
              <path d="M3 6h18" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 书签列表 -->
      <main class="bookmarks-content">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="bookmarks.length === 0" class="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h3>还没有收藏任何文章</h3>
          <p>
            去<router-link to="/blog">文章列表</router-link
            >收藏一些感兴趣的文章吧！
          </p>
        </div>

        <!-- 无搜索结果 -->
        <div v-else-if="filteredBookmarks.length === 0" class="empty-state">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <h3>没有找到相关书签</h3>
          <p>尝试调整搜索条件或筛选选项</p>
        </div>

        <!-- 书签卡片列表 -->
        <div v-else class="bookmarks-grid">
          <article
            v-for="bookmark in filteredBookmarks"
            :key="bookmark.slug"
            class="bookmark-card"
          >
            <!-- 卡片头部 -->
            <div class="card-header">
              <h2 class="bookmark-title" @click="goToArticle(bookmark.slug)">
                {{ bookmark.title }}
              </h2>
              <BookmarkButton
                :article-slug="bookmark.slug"
                :article-data="bookmark"
                size="small"
                variant="minimal"
                @bookmark-removed="handleRemoveBookmark"
              />
            </div>

            <!-- 文章摘要 -->
            <p v-if="bookmark.excerpt" class="bookmark-excerpt">
              {{ bookmark.excerpt }}
            </p>

            <!-- 标签 -->
            <div v-if="bookmark.tags?.length" class="bookmark-tags">
              <span
                v-for="tag in bookmark.tags.slice(0, 3)"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
              <span v-if="bookmark.tags.length > 3" class="tag-more">
                +{{ bookmark.tags.length - 3 }}
              </span>
            </div>

            <!-- 卡片底部 -->
            <div class="card-footer">
              <div class="bookmark-meta">
                <span class="publish-date">{{
                  formatDate(new Date(bookmark.date).getTime())
                }}</span>
                <span class="separator">·</span>
                <span class="bookmark-time">{{
                  formatBookmarkTime(bookmark.bookmarkedAt)
                }}</span>
              </div>
              <button @click="goToArticle(bookmark.slug)" class="read-btn">
                阅读
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-page {
  min-height: 100vh;
  background: var(--color-background);
  padding-top: calc(var(--nav-height, 4rem) + 2rem);
  padding-bottom: 2rem;
}

.container {
  max-width: var(--container-max-width, 1200px);
  margin: 0 auto;
  padding: 0 var(--container-padding, 1rem);
}

/* 页面头部 */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;

  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-secondary-text);
  margin: 0;
}

/* 筛选区域 */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.search-container {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-secondary-text);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;

  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);

  padding: 0.25rem;
  background: transparent;
  border: none;
  color: var(--color-secondary-text);
  cursor: pointer;
  border-radius: var(--radius-md);

  transition: all var(--transition-normal);
}

.clear-search:hover {
  background: var(--color-tertiary-background);
  color: var(--color-text);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;

  transition: all var(--transition-normal);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.sort-order-btn {
  padding: 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-secondary-text);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all var(--transition-normal);
}

.sort-order-btn:hover {
  background: var(--color-secondary-background);
  color: var(--color-text);
}

.sort-order-btn svg {
  transition: transform var(--transition-normal);
}

.sort-order-btn svg.rotate-180 {
  transform: rotate(180deg);
}

/* 内容区域 */
.bookmarks-content {
  min-height: 400px;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state svg {
  color: var(--color-secondary-text);
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-secondary-text);
  margin: 0;
}

.empty-state a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.empty-state a:hover {
  text-decoration: underline;
}

/* 书签网格 */
.bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* 书签卡片 */
.bookmark-card {
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;

  transition: all var(--transition-normal);
  cursor: pointer;
}

.bookmark-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.bookmark-title {
  flex: 1;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
  margin: 0;
  cursor: pointer;

  transition: color var(--transition-normal);
}

.bookmark-title:hover {
  color: var(--color-primary);
}

.bookmark-excerpt {
  color: var(--color-secondary-text);
  line-height: 1.6;
  margin-bottom: 1rem;

  /* 限制显示行数 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bookmark-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.tag-more {
  padding: 0.25rem 0.75rem;
  background: var(--color-border);
  color: var(--color-secondary-text);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.bookmark-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-secondary-text);
}

.separator {
  opacity: 0.5;
}

.read-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;

  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;

  transition: all var(--transition-normal);
}

.read-btn:hover {
  background: var(--color-primary-dark);
  transform: translateX(2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bookmarks-page {
    padding-top: calc(var(--nav-height, 4rem) + 1rem);
  }

  .page-title {
    font-size: 2rem;
  }

  .filters-section {
    padding: 1rem;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select,
  .sort-order-btn {
    width: 100%;
  }

  .bookmarks-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .bookmark-card {
    padding: 1rem;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .read-btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .bookmark-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

/* 暗色主题适配 */
.dark-theme .bookmark-card {
  background: var(--color-card-background);
  border-color: var(--color-border);
}

.dark-theme .bookmark-card:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -4px rgba(0, 0, 0, 0.2);
}
</style>

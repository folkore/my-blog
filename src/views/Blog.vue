<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import SearchBar from "../components/SearchBar.vue";
import TagFilter from "../components/TagFilter.vue";

const { t, locale } = useI18n();

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

// 模拟博客文章数据
const blogPosts = ref([
  {
    id: 1,
    title: "开始使用 Vue 3 和组合式 API",
    summary: "探索 Vue 3 的新特性和组合式 API 如何改变我们的开发方式。",
    cover: "https://picsum.photos/id/180/800/450",
    date: "2023-06-15",
    tags: ["Vue", "JavaScript", "前端开发"],
  },
  {
    id: 2,
    title: "响应式设计最佳实践",
    summary: "学习创建在所有设备上看起来都很棒的响应式网站的技巧和策略。",
    cover: "https://picsum.photos/id/1/800/450",
    date: "2023-05-22",
    tags: ["CSS", "响应式设计", "前端开发"],
  },
  {
    id: 3,
    title: "使用 Node.js 和 Express 构建 RESTful API",
    summary: "从头开始构建一个功能完整的 RESTful API 的分步指南。",
    cover: "https://picsum.photos/id/0/800/450",
    date: "2023-04-10",
    tags: ["Node.js", "Express", "后端开发", "API"],
  },
  {
    id: 4,
    title: "CSS Grid 与 Flexbox：何时使用？",
    summary: "深入比较这两种布局方法，并了解何时使用每种方法。",
    cover: "https://picsum.photos/id/1024/800/450",
    date: "2023-03-05",
    tags: ["CSS", "布局", "前端开发"],
  },
]);

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

  // 实际应用中这里会是一个 API 调用
  // fetchBlogPosts();
});

onUnmounted(() => {
  // 移除语言变化事件监听
  window.removeEventListener("language-changed", handleLanguageChanged);
});

// 搜索和筛选
const searchQuery = ref("");
const selectedTags = ref([]);
const currentPage = ref(1);
const postsPerPage = 6;

// 获取所有标签
const allTags = computed(() => {
  const tags = [];
  blogPosts.value.forEach((post) => {
    post.tags.forEach((tag) => tags.push(tag));
  });
  return tags;
});

// 根据搜索和标签筛选文章
const filteredPosts = computed(() => {
  let result = blogPosts.value;

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.summary.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // 标签筛选
  if (selectedTags.value.length > 0) {
    result = result.filter((post) =>
      post.tags.some((tag) => selectedTags.value.includes(tag))
    );
  }

  return result;
});

// 分页相关
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPosts.value.length / postsPerPage))
);

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return filteredPosts.value.slice(start, end);
});

// 处理搜索
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1; // 重置页码
};

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<template>
  <div class="blog">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">{{ t("blog.title") }}</h1>
        <p class="page-description">分享我的技术见解和开发经验</p>
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
          <SearchBar :placeholder="t('blog.search')" @search="handleSearch" />

          <!-- 标签筛选组件 -->
          <TagFilter :tags="allTags" v-model:selectedTags="selectedTags" />
        </div>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="posts-section">
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 无结果提示 -->
        <div v-else-if="filteredPosts.length === 0" class="no-results">
          <p>{{ t("blog.noResults") }}</p>
        </div>

        <!-- 文章列表 -->
        <div v-else class="posts-grid">
          <article
            v-for="post in paginatedPosts"
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
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-excerpt">{{ post.summary }}</p>
              <div class="post-meta">
                <div class="meta-left">
                  <span class="post-date">{{ post.date }}</span>
                </div>
                <router-link :to="'/blog/' + post.id" class="post-link">
                  {{ t("home.latestPosts.readMore") }}
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

        <!-- 分页 -->
        <div v-if="filteredPosts.length > 0" class="pagination">
          <button
            class="pagination-button"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            <svg
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button
            class="pagination-button"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            下一页
            <svg
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog {
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  position: relative;
  padding: 4rem 0;
  background: var(--bg-secondary);
  overflow: hidden;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.page-description {
  font-size: 1.25rem;
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
  padding: 2rem 0;
  border-bottom: 1px solid var(--border-color);
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 文章列表 */
.posts-section {
  padding: 3rem 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: var(--card-shadow);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.post-image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  padding: 1.5rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.post-tag {
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 20px;
  font-size: 0.875rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  color: var(--text-primary);
}

.post-excerpt {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.meta-left {
  display: flex;
  gap: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.post-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.post-link svg {
  transition: transform 0.3s ease;
}

.post-link:hover svg {
  transform: translateX(4px);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .filters {
    gap: 1rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pagination-button {
    width: 100%;
    justify-content: center;
  }
}
</style>

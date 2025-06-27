<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { usePostsStore } from "../store";
import { useSearch } from "../composables/useSearch";
import RiverBackground from "./RiverBackground.vue";
import ArticleCapsule from "./ArticleCapsule.vue";
import TimeNavigator from "./TimeNavigator.vue";
import StarSearchPanel from "./StarSearchPanel.vue";

const { t, locale } = useI18n();
const postsStore = usePostsStore();
const { searchQuery, searchResults, performSearch } = useSearch(true);

// 响应式数据
const isLoading = ref(false);
const selectedTags = ref([]);
const postsPerPage = 6;
const postsShown = ref(postsPerPage);
const forceUpdate = ref(false);

// 时间导航相关
const selectedYear = ref(null);
const timelineYears = ref([]);

// 从 store 获取博客文章
const blogPosts = computed(() => postsStore.posts);

// 计算需要展示的文章列表
const displayedPosts = computed(() =>
  finalFilteredPosts.value.slice(0, postsShown.value)
);

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

  // 按年份筛选
  if (selectedYear.value) {
    posts = posts.filter((post) => {
      const postYear = new Date(post.date).getFullYear();
      return postYear === selectedYear.value;
    });
  }

  return posts;
});

// 获取所有标签
const allTags = computed(() => {
  const tags = new Set();
  blogPosts.value.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
});

// 计算时间轴年份
const calculateTimelineYears = () => {
  const years = new Set();
  blogPosts.value.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    years.add(year);
  });
  timelineYears.value = Array.from(years).sort((a, b) => b - a);
};

// 交叉观察器加载更多
const sentinel = ref(null);
let observer = null;

const loadMore = () => {
  if (postsShown.value < finalFilteredPosts.value.length) {
    postsShown.value += postsPerPage;
  }
};

// 监听语言变化事件
const handleLanguageChanged = () => {
  forceUpdate.value = !forceUpdate.value;
};

// 处理搜索
const handleSearch = (query) => {
  searchQuery.value = query;
};

// 处理标签选择
const handleTagSelect = (tags) => {
  selectedTags.value = tags;
  postsShown.value = postsPerPage; // 重置显示数量
};

// 处理年份选择
const handleYearSelect = (year) => {
  selectedYear.value = year;
  postsShown.value = postsPerPage; // 重置显示数量
};

// 监听搜索框输入，执行搜索
watch(searchQuery, (newQuery) => {
  performSearch();
  postsShown.value = postsPerPage; // 重置显示数量
});

// 监听语言变化
watch(locale, () => {
  forceUpdate.value = !forceUpdate.value;
});

onMounted(() => {
  // 添加语言变化事件监听
  window.addEventListener("language-changed", handleLanguageChanged);

  // 计算时间轴年份
  calculateTimelineYears();

  // 模拟加载
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);

  // 设置交叉观察器
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
  window.removeEventListener("language-changed", handleLanguageChanged);
  if (observer && sentinel.value) observer.unobserve(sentinel.value);
});
</script>

<template>
  <div class="time-river-blog">
    <!-- 河流背景 -->
    <RiverBackground />

    <!-- 星象搜索面板 -->
    <StarSearchPanel
      :all-tags="allTags"
      :selected-tags="selectedTags"
      @search="handleSearch"
      @tag-select="handleTagSelect"
    />

    <!-- 时间导航器 -->
    <TimeNavigator
      :years="timelineYears"
      :selected-year="selectedYear"
      @year-select="handleYearSelect"
    />

    <!-- 页面标题区域 -->
    <header class="river-header">
      <div class="header-content">
        <h1 class="river-title">{{ t("blog.riverTitle", "时光之河") }}</h1>
        <p class="river-subtitle">
          {{
            t("blog.riverSubtitle", "在时间的长河中，每个故事都是珍贵的记忆")
          }}
        </p>
      </div>
    </header>

    <!-- 文章胶囊容器 -->
    <main class="capsules-container">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">
          {{ t("blog.riverLoading", "时光正在汇聚...") }}
        </p>
      </div>

      <!-- 无结果提示 -->
      <div v-else-if="finalFilteredPosts.length === 0" class="no-results">
        <div class="no-results-icon">✨</div>
        <p class="no-results-text">
          {{ t("blog.riverNoResults", "这片时空还没有相关的故事...") }}
        </p>
      </div>

      <!-- 文章胶囊列表 -->
      <div v-else class="capsules-flow">
        <ArticleCapsule
          v-for="(post, index) in displayedPosts"
          :key="post.id"
          :post="post"
          :index="index"
          :style="{ '--capsule-index': index }"
        />
      </div>

      <!-- Sentinel 元素，用于触发加载更多 -->
      <div ref="sentinel" class="load-more-sentinel"></div>
    </main>
  </div>
</template>

<style scoped>
.time-river-blog {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background: transparent;
}

/* 页面标题区域 */
.river-header {
  position: relative;
  z-index: 10;
  padding: 6rem 2rem 4rem;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.river-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 600;
  margin-bottom: 1.5rem;
  background: var(--title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGlow 4s ease-in-out infinite alternate;
}

.river-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--subtitle-color);
  line-height: 1.6;
  animation: subtitleFloat 6s ease-in-out infinite;
}

/* 深浅主题标题样式 */
.dark-theme .river-title {
  --title-gradient: linear-gradient(
    135deg,
    #93c5fd 0%,
    #7c3aed 25%,
    #3b82f6 50%,
    #1e40af 75%,
    #1e3a8a 100%
  );
}

.dark-theme .river-subtitle {
  --subtitle-color: rgba(203, 213, 225, 0.8);
}

:root .river-title {
  --title-gradient: linear-gradient(
    135deg,
    #1e40af 0%,
    #3730a3 25%,
    #1e3a8a 50%,
    #312e81 75%,
    #1e1b4b 100%
  );
}

:root .river-subtitle {
  --subtitle-color: rgba(71, 85, 105, 0.8);
}

/* 文章胶囊容器 */
.capsules-container {
  position: relative;
  z-index: 5;
  padding: 2rem;
  min-height: 60vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: var(--loading-color);
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--spinner-bg);
  border-top-color: var(--spinner-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.loading-text {
  font-size: 1.125rem;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--no-results-color);
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

.no-results-text {
  font-size: 1.125rem;
}

/* 深浅主题状态样式 */
.dark-theme .loading-container {
  --loading-color: rgba(203, 213, 225, 0.8);
}

.dark-theme .loading-spinner {
  --spinner-bg: rgba(51, 65, 85, 0.3);
  --spinner-color: #60a5fa;
}

.dark-theme .no-results {
  --no-results-color: rgba(148, 163, 184, 0.7);
}

/* 浅色主题状态样式 - 修复颜色问题 */
.loading-container {
  --loading-color: rgba(71, 85, 105, 0.8);
}

.loading-spinner {
  --spinner-bg: rgba(203, 213, 225, 0.3);
  --spinner-color: #3b82f6;
}

.no-results {
  --no-results-color: rgba(100, 116, 139, 0.7);
}

/* 文章胶囊流布局 */
.capsules-flow {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* 减少间距从3rem到1.5rem */
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0; /* 减少上下内边距 */
}

.load-more-sentinel {
  height: 1px;
  margin-top: 2rem;
}

/* 动画定义 - 优化版 */
@keyframes titleGlow {
  0% {
    filter: brightness(1) drop-shadow(0 0 15px rgba(59, 130, 246, 0.2));
  }
  100% {
    filter: brightness(1.1) drop-shadow(0 0 25px rgba(59, 130, 246, 0.3));
  }
}

@keyframes subtitleFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .capsules-flow {
    gap: 2rem; /* 减少桌面端间距从4rem到2rem */
  }
}

@media (min-width: 1200px) {
  .capsules-container {
    padding: 2rem 4rem;
  }
}
</style>

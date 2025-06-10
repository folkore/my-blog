<script setup>
import { ref, onMounted } from "vue";

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
  // 模拟加载
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 500);

  // 实际应用中这里会是一个 API 调用
  // fetchBlogPosts();
});

// 跳转到博客文章详情
const navigateToBlogPost = (id) => {
  // 使用路由导航到文章详情页
};
</script>

<template>
  <div class="blog-page container">
    <header class="page-header">
      <h1>博客文章</h1>
      <p class="subtitle">分享我的思考、经验和知识</p>
    </header>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载文章中...</p>
    </div>

    <section v-else class="blog-posts">
      <article
        v-for="post in blogPosts"
        :key="post.id"
        class="blog-post-card"
        @click="$router.push(`/blog/${post.id}`)"
      >
        <div class="post-image">
          <img :src="post.cover" :alt="post.title" />
        </div>
        <div class="post-content">
          <div class="post-date">{{ post.date }}</div>
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-summary">{{ post.summary }}</p>
          <div class="post-tags">
            <span
              v-for="(tag, index) in post.tags"
              :key="index"
              class="post-tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="read-more">阅读更多 →</div>
        </div>
      </article>
    </section>

    <div v-if="!isLoading && blogPosts.length === 0" class="empty-state">
      <p>暂无博客文章</p>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
  padding: 60px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  color: var(--color-secondary-text);
}

.blog-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
}

.blog-post-card {
  background-color: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px var(--color-shadow);
  transition: all 0.3s ease;
  cursor: pointer;
}

.blog-post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px var(--color-shadow);
}

.post-image {
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-post-card:hover .post-image img {
  transform: scale(1.05);
}

.post-content {
  padding: 24px;
}

.post-date {
  font-size: 14px;
  color: var(--color-secondary-text);
  margin-bottom: 8px;
}

.post-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--color-text);
  line-height: 1.3;
}

.post-summary {
  font-size: 16px;
  color: var(--color-secondary-text);
  margin-bottom: 16px;
  line-height: 1.5;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.post-tag {
  font-size: 12px;
  background-color: var(--color-secondary-background);
  color: var(--color-text);
  padding: 4px 10px;
  border-radius: 100px;
}

.read-more {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-link);
  margin-top: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  border: 4px solid var(--color-secondary-background);
  border-top: 4px solid var(--color-link);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--color-secondary-text);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .blog-posts {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 36px;
  }
}
</style>

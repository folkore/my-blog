<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 博客文章列表（示例数据）
const latestPosts = ref([
  {
    id: 1,
    title: "如何使用Vue3和Vite构建现代化Web应用",
    excerpt:
      "Vue3和Vite提供了令人难以置信的开发体验，本文将介绍如何利用这些工具构建现代化Web应用...",
    date: "2023-06-10",
    image: "https://picsum.photos/id/1/800/450",
    tags: ["Vue3", "Vite", "前端开发"],
  },
  {
    id: 2,
    title: "在Vue3中实现深色模式切换",
    excerpt:
      "本文将深入探讨如何在Vue3应用中实现漂亮的深色模式切换效果，包括保存用户偏好设置...",
    date: "2023-05-28",
    image: "https://picsum.photos/id/2/800/450",
    tags: ["Vue3", "深色模式", "CSS变量"],
  },
  {
    id: 3,
    title: "CSS变量的高级用法",
    excerpt:
      "CSS变量（自定义属性）为前端开发带来了更多的灵活性，本文将介绍一些高级用法和技巧...",
    date: "2023-05-15",
    image: "https://picsum.photos/id/3/800/450",
    tags: ["CSS", "前端设计", "Web开发"],
  },
]);

// 导航到博客文章
const navigateToPost = (id) => {
  router.push(`/blog/${id}`);
};
</script>

<template>
  <div class="home">
    <!-- 简介区域 -->
    <section class="intro-section">
      <div class="container">
        <div class="intro-content">
          <h1>我相信优雅的设计和高效的代码</h1>
          <p class="intro-text">并努力在每个项目中体现这些价值。</p>
          <div class="intro-buttons">
            <button class="button primary-button" @click="router.push('/blog')">
              浏览文章
            </button>
            <button
              class="button secondary-button"
              @click="router.push('/about')"
            >
              了解更多
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="latest-posts container">
      <h2 class="section-title">最新文章</h2>
      <div class="posts-grid">
        <article
          v-for="post in latestPosts"
          :key="post.id"
          class="post-card"
          @click="navigateToPost(post.id)"
        >
          <div class="post-image">
            <img :src="post.image" :alt="post.title" />
          </div>
          <div class="post-content">
            <div class="post-tags">
              <span v-for="(tag, index) in post.tags" :key="index" class="tag">
                {{ tag }}
              </span>
            </div>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="post-date">{{ post.date }}</span>
              <span class="read-more">阅读更多 →</span>
            </div>
          </div>
        </article>
      </div>
      <div class="view-all">
        <button class="button secondary-button" @click="router.push('/blog')">
          查看所有文章
        </button>
      </div>
    </section>

    <!-- 订阅区域 -->
    <section class="subscribe-section">
      <div class="container">
        <div class="subscribe-content">
          <h2>订阅我的通讯</h2>
          <p>获取最新的文章更新和技术动态，直接发送到您的邮箱。</p>
          <div class="subscribe-form">
            <input
              type="email"
              placeholder="您的邮箱地址"
              class="email-input"
            />
            <button class="button primary-button">订阅</button>
          </div>
          <p class="subscribe-note">我会保护您的隐私，不会发送垃圾邮件。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background-color: var(--color-background);
}

/* 简介区域样式 */
.intro-section {
  padding: 40px 0 60px;
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-secondary-background) 100%
  );
  border-bottom: 1px solid var(--color-border);
}

.intro-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.intro-content h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.intro-text {
  font-size: 1.25rem;
  color: var(--color-secondary-text);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.intro-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* 最新文章区域 */
.latest-posts {
  padding: 60px 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2rem;
  text-align: center;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px var(--color-shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px var(--color-shadow);
}

.post-image {
  height: 200px;
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
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-secondary-background);
  color: var(--color-text);
  border-radius: 100px;
}

.post-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.post-content p {
  font-size: 1rem;
  color: var(--color-secondary-text);
  margin-bottom: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-secondary-text);
}

.read-more {
  color: var(--color-link);
  font-weight: 500;
}

.view-all {
  text-align: center;
}

/* 订阅区域样式 */
.subscribe-section {
  background-color: var(--color-secondary-background);
  padding: 60px 0;
  margin-top: 2rem;
}

.subscribe-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.subscribe-content h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.subscribe-content p {
  font-size: 1.125rem;
  color: var(--color-secondary-text);
  margin-bottom: 2rem;
}

.subscribe-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.email-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.email-input:focus {
  outline: none;
  border-color: var(--color-link);
}

.subscribe-note {
  font-size: 0.875rem;
  color: var(--color-secondary-text);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .intro-content h1 {
    font-size: 2rem;
  }

  .intro-text {
    font-size: 1.125rem;
  }

  .intro-buttons {
    flex-direction: column;
  }

  .intro-buttons .button {
    width: 100%;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .subscribe-form .button {
    width: 100%;
  }
}

/* 按钮样式 */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.primary-button {
  background-color: var(--color-link);
  color: white;
}

.primary-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.secondary-button {
  background-color: var(--color-secondary-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.secondary-button:hover {
  background-color: var(--color-background);
  transform: translateY(-1px);
}
</style>

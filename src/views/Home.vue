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
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">我相信优雅的设计</span>
            <br />和高效的代码
          </h1>
          <p class="hero-description">探索技术的无限可能，分享开发的点点滴滴</p>
          <div class="hero-actions">
            <router-link to="/blog" class="btn btn-primary">
              浏览文章
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
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </router-link>
            <router-link to="/about" class="btn btn-secondary">
              了解更多
            </router-link>
          </div>
        </div>
      </div>
      <div class="hero-background">
        <div class="hero-shape-1"></div>
        <div class="hero-shape-2"></div>
        <div class="hero-shape-3"></div>
      </div>
    </section>

    <!-- 最新文章区域 -->
    <section class="latest-posts">
      <div class="container">
        <h2 class="section-title">最新文章</h2>
        <div class="posts-grid">
          <article v-for="post in latestPosts" :key="post.id" class="post-card">
            <div class="post-image">
              <img v-lazy="post.image" :alt="post.title" />
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
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-meta">
                <span class="post-date">{{ post.date }}</span>
                <router-link :to="'/blog/' + post.id" class="post-link">
                  阅读更多
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
        <div class="section-actions">
          <router-link to="/blog" class="btn btn-outline">
            查看所有文章
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 技术栈区域 -->
    <section class="tech-stack">
      <div class="container">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-grid">
          <div class="tech-card">
            <div class="tech-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <h3>前端开发</h3>
            <p>Vue.js, React, TypeScript</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </div>
            <h3>后端开发</h3>
            <p>Node.js, Python, Go</p>
          </div>
          <div class="tech-card">
            <div class="tech-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3>DevOps</h3>
            <p>Docker, Kubernetes, CI/CD</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero 区域 */
.hero {
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  background: var(--color-secondary-background);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--color-secondary-text);
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.hero-shape-1,
.hero-shape-2,
.hero-shape-3 {
  position: absolute;
  border-radius: 50%;
  filter: blur(var(--blur-lg));
}

.hero-shape-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary);
  opacity: 0.1;
  top: -100px;
  right: -100px;
}

.hero-shape-2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent);
  opacity: 0.1;
  bottom: -50px;
  left: -50px;
}

.hero-shape-3 {
  width: 200px;
  height: 200px;
  background: var(--color-primary-light);
  opacity: 0.1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-normal) var(--bezier-bounce);
  position: relative;
  overflow: hidden;
}

.btn svg {
  transition: transform var(--transition-normal) var(--bezier-bounce);
}

.btn:hover svg {
  transform: translateX(4px);
}

.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s var(--bezier-smooth);
}

.btn:hover::before {
  transform: translateX(100%);
}

.btn-primary {
  background: var(--color-primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--color-tertiary-background);
  color: var(--color-text);
}

.btn-secondary:hover {
  background: var(--color-secondary-background);
  transform: translateY(-2px);
}

.btn-outline {
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* 最新文章区域 */
.latest-posts {
  padding: 6rem 0;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2px;
  background: var(--color-primary-gradient);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: var(--color-background);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal) var(--bezier-bounce);
  border: 1px solid var(--color-border);
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.post-image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal) var(--bezier-smooth);
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
  background: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.post-excerpt {
  color: var(--color-secondary-text);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.post-date {
  color: var(--color-tertiary-text);
  font-size: 0.875rem;
}

.post-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.post-link svg {
  transition: transform var(--transition-normal) var(--bezier-bounce);
}

.post-link:hover svg {
  transform: translateX(4px);
}

.section-actions {
  text-align: center;
}

/* 技术栈区域 */
.tech-stack {
  padding: 6rem 0;
  background: var(--color-secondary-background);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.tech-card {
  background: var(--color-background);
  padding: 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-normal) var(--bezier-bounce);
  border: 1px solid var(--color-border);
}

.tech-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.tech-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  background: var(--color-tertiary-background);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  transition: all var(--transition-normal) var(--bezier-bounce);
}

.tech-card:hover .tech-icon {
  background: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

.tech-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.tech-card p {
  color: var(--color-secondary-text);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>

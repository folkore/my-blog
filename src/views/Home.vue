<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

// 博客文章列表（示例数据）
const latestPosts = ref([
  {
    id: 1,
    title: "Vue 3 组合式 API 实践指南",
    excerpt:
      "探索 Vue 3 组合式 API 的最佳实践和使用技巧，提升代码的可维护性和复用性。",
    image: "https://picsum.photos/id/1/800/400",
    date: "2024-03-15",
    tags: ["Vue.js", "JavaScript", "前端开发"],
  },
  {
    id: 2,
    title: "构建高性能的 Web 应用",
    excerpt:
      "学习如何优化 Web 应用的性能，包括代码分割、懒加载、缓存策略等技术。",
    image: "https://picsum.photos/id/2/800/400",
    date: "2024-03-10",
    tags: ["性能优化", "Web开发", "前端开发"],
  },
  {
    id: 3,
    title: "现代 CSS 技术解析",
    excerpt: "深入了解 CSS Grid、Flexbox、CSS 变量等现代 CSS 技术的应用。",
    image: "https://picsum.photos/id/3/800/400",
    date: "2024-03-05",
    tags: ["CSS", "Web开发", "前端开发"],
  },
]);

// 导航到博客文章
const navigateToPost = (id) => {
  router.push(`/blog/${id}`);
};
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ t("home.hero.title") }}</h1>
          <p class="hero-description">{{ t("home.hero.description") }}</p>
          <router-link to="/blog" class="hero-button">
            {{ t("home.hero.browseArticles") }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Latest Posts Section -->
    <section class="latest-posts">
      <div class="container">
        <h2 class="section-title">{{ t("home.latestPosts.title") }}</h2>
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
                  {{ t("home.latestPosts.readMore") }}
                </router-link>
              </div>
            </div>
          </article>
        </div>
        <div class="view-all">
          <router-link to="/blog" class="view-all-link">
            {{ t("home.latestPosts.viewAll") }}
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

/* Hero Section */
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

.hero-description {
  font-size: 1.25rem;
  color: var(--color-secondary-text);
  margin-bottom: 2rem;
}

.hero-button {
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
  background: var(--color-primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.hero-button svg {
  transition: transform var(--transition-normal) var(--bezier-bounce);
}

.hero-button:hover svg {
  transform: translateX(4px);
}

.hero-button::before {
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

.hero-button:hover::before {
  transform: translateX(100%);
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

/* Latest Posts Section */
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

.view-all {
  text-align: center;
}

.view-all-link {
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
  background: var(--color-primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.view-all-link:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.view-all-link svg {
  transition: transform var(--transition-normal) var(--bezier-bounce);
}

.view-all-link:hover svg {
  transform: translateX(4px);
}

.view-all-link::before {
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

.view-all-link:hover::before {
  transform: translateX(100%);
}

/* Tech Stack Section */
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

/* Responsive Design */
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

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }
}
</style>

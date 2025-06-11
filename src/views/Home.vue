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
      <div class="hero-background">
        <div class="hero-shape-1"></div>
        <div class="hero-shape-2"></div>
        <div class="hero-shape-3"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-avatar">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="头像"
              class="avatar-image"
            />
          </div>
          <h1 class="hero-title">{{ t("home.hero.title") }}</h1>
          <p class="hero-description">{{ t("home.hero.description") }}</p>
          <div class="hero-tags">
            <span class="hero-tag">Vue.js</span>
            <span class="hero-tag">React</span>
            <span class="hero-tag">Node.js</span>
            <span class="hero-tag">TypeScript</span>
            <span class="hero-tag">全栈开发</span>
          </div>
          <div class="hero-social">
            <a
              href="https://github.com"
              target="_blank"
              class="social-link"
              title="GitHub"
            >
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
                <path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                ></path>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              class="social-link"
              title="Twitter"
            >
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
                <path
                  d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                ></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              class="social-link"
              title="LinkedIn"
            >
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
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                ></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          <div class="hero-buttons">
            <router-link to="/blog" class="hero-button primary">
              {{ t("home.hero.browseArticles") }}
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
            <router-link to="/about" class="hero-button secondary">
              {{ t("nav.about") }}
            </router-link>
          </div>
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
                <router-link :to="`/blog/${post.id}`" class="post-link">
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
  padding: 8rem 0;
  overflow: hidden;
  background: var(--color-secondary-background);
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-avatar {
  width: 160px;
  height: 160px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--color-primary);
  box-shadow: var(--shadow-lg);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleFade 1s ease-out;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--color-secondary-text);
  margin-bottom: 2rem;
  animation: fadeUp 1s ease-out 0.2s both;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
  animation: fadeUp 1s ease-out 0.4s both;
}

.hero-tag {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-full);
  background: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  font-size: 0.875rem;
  transition: all var(--transition-normal) var(--bezier-bounce);
}

.hero-tag:hover {
  transform: translateY(-2px);
  background: var(--color-primary-gradient);
  color: white;
}

.hero-social {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  animation: fadeUp 1s ease-out 0.6s both;
}

.social-link {
  color: var(--color-secondary-text);
  transition: all var(--transition-normal) var(--bezier-bounce);
}

.social-link:hover {
  color: var(--color-primary);
  transform: translateY(-2px);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeUp 1s ease-out 0.8s both;
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
}

.hero-button.primary {
  background: var(--color-primary-gradient);
  color: white;
  box-shadow: var(--shadow-md);
}

.hero-button.secondary {
  background: var(--color-tertiary-background);
  color: var(--color-text);
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
  animation: float 6s ease-in-out infinite;
}

.hero-shape-1 {
  width: 400px;
  height: 400px;
  background: var(--color-primary);
  opacity: 0.1;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.hero-shape-2 {
  width: 300px;
  height: 300px;
  background: var(--color-accent);
  opacity: 0.1;
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

.hero-shape-3 {
  width: 200px;
  height: 200px;
  background: var(--color-primary-light);
  opacity: 0.1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes titleFade {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    padding: 6rem 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .hero-avatar {
    width: 120px;
    height: 120px;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .hero-button {
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

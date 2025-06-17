<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { throttle } from "lodash-es";
import { usePostsStore } from "../store";

const { t } = useI18n();

// 获取最新文章（取日期倒序前三篇）
const postsStore = usePostsStore();
const latestPosts = computed(() => postsStore.posts.slice(0, 3));

const avatarUrl = ref("");
const avatarLoaded = ref(false);
const heroAvatarRef = ref(null);
let observer = null;

const handleAvatarMove = throttle((e) => {
  if (!heroAvatarRef.value) return;
  const rect = heroAvatarRef.value.getBoundingClientRect();
  const offsetX = e.clientX - rect.left - rect.width / 2;
  const offsetY = e.clientY - rect.top - rect.height / 2;
  const tiltX = (offsetY / rect.height) * 15; // max 15deg
  const tiltY = (-offsetX / rect.width) * 15;
  heroAvatarRef.value.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});

const resetAvatarTilt = () => {
  if (heroAvatarRef.value) {
    heroAvatarRef.value.style.transform = "";
  }
};

onMounted(async () => {
  try {
    // 调用 waifu.pics API 获取随机二次元头像
    const res = await fetch("https://api.waifu.pics/sfw/waifu");
    const data = await res.json();
    avatarUrl.value = data.url;
  } catch (error) {
    // 如果请求失败，可在控制台查看原因，或回退到占位图
    console.error("获取动漫头像失败:", error);
  }

  // IntersectionObserver 逻辑
  if (heroAvatarRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (heroAvatarRef.value) {
            // 根据元素是否可见来控制动画的播放状态
            heroAvatarRef.value.style.animationPlayState = entry.isIntersecting
              ? "running"
              : "paused";
          }
        });
      },
      { threshold: 0.1 } // 可见度达到10%时触发
    );
    observer.observe(heroAvatarRef.value);
  }
});

onUnmounted(() => {
  // 组件卸载时停止观察，清理资源
  if (observer && heroAvatarRef.value) {
    observer.unobserve(heroAvatarRef.value);
  }
});
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
          <div
            class="hero-avatar"
            :class="{ loading: !avatarLoaded }"
            ref="heroAvatarRef"
            @mousemove="handleAvatarMove"
            @mouseleave="resetAvatarTilt"
          >
            <div v-if="!avatarLoaded" class="avatar-placeholder"></div>
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="头像"
              class="avatar-image"
              :class="{ loaded: avatarLoaded }"
              @load="avatarLoaded = true"
            />
          </div>
          <h1 class="hero-title">{{ t("home.hero.title") }}</h1>
          <p class="hero-description">{{ t("home.hero.description") }}</p>
          <div class="hero-tags">
            <span class="hero-tag">Vue.js</span>
            <span class="hero-tag">React</span>
            <span class="hero-tag">TypeScript</span>
            <span class="hero-tag">前端开发</span>
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
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-meta">
                <span class="post-date">{{ post.date }}</span>
                <router-link :to="`/blog/${post.slug}`" class="post-link">
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
            <h3>前端框架</h3>
            <p>Vue.js, React, Solid.js</p>
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
            <h3>语言与工具</h3>
            <p>TypeScript, Vite, Webpack</p>
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
            <h3>UI & 可视化</h3>
            <p>SCSS, TailwindCSS, D3.js</p>
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
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: visible;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e9f0ff 100%);
  animation: avatar-float 6s ease-in-out infinite;
  transition: transform 0.25s ease-out;
  will-change: transform;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transition: opacity 0.6s ease;
}

.avatar-image.loaded {
  opacity: 1;
}

.hero-avatar::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    rgba(var(--color-primary-rgb), 0.6) 0%,
    rgba(var(--color-primary-light-rgb), 0.4) 25%,
    rgba(var(--color-accent-rgb), 0.6) 50%,
    rgba(var(--color-primary-rgb), 0.6) 100%
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 4px),
    #000 calc(100% - 4px)
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 4px),
    #000 calc(100% - 4px)
  );
  z-index: -1;
}

@keyframes avatar-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
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
  display: flex;
  flex-direction: column;
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
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
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
  margin-top: auto;
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
@media (max-width: 1024px) {
  .posts-grid {
    column-count: 2;
  }
}

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

.avatar-placeholder {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: linear-gradient(115deg, #f5f7ff 25%, #eef2ff 40%, #f5f7ff 65%);
  background-size: 200% 100%;
  animation: placeholder-shimmer 2.4s linear infinite;
  filter: blur(0.2px);
}

@keyframes placeholder-shimmer {
  0% {
    background-position: 180% 0;
  }
  100% {
    background-position: -180% 0;
  }
}

.hero-avatar.loading::after {
  content: "";
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 136, 255, 0.4) 0%,
    transparent 70%
  );
  filter: blur(12px);
  opacity: 0.4;
  animation: glow-pulse 4s ease-in-out infinite;
  z-index: -3;
}

@keyframes glow-pulse {
  0%,
  100% {
    transform: scale(0.85);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.5;
  }
}

.hero-avatar:hover {
  /* animation-play-state: paused; */ /* 性能优化：移除此规则，让鼠标悬停和浮动动画更自然地结合 */
}
</style>

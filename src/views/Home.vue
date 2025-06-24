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

const techGridRef = ref(null);

const handleCardMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
  const rotateY = ((x - centerX) / centerX) * 10; // Max 10deg

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;

  const icon = card.querySelector(".tech-icon");
  const text = card.querySelector("h3");
  const paragraph = card.querySelector("p");

  const moveFactor = 0.08;
  if (icon)
    icon.style.transform = `translateX(${(x - centerX) * moveFactor}px) translateY(${
      (y - centerY) * moveFactor
    }px) translateZ(20px)`;
  if (text)
    text.style.transform = `translateX(${
      (x - centerX) * (moveFactor * 0.8)
    }px) translateY(${(y - centerY) * (moveFactor * 0.8)}px) translateZ(15px)`;
  if (paragraph)
    paragraph.style.transform = `translateX(${
      (x - centerX) * (moveFactor * 0.6)
    }px) translateY(${(y - centerY) * (moveFactor * 0.6)}px) translateZ(10px)`;
};

const handleCardMouseLeave = (e) => {
  const card = e.currentTarget;
  card.style.transform =
    "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";

  const icon = card.querySelector(".tech-icon");
  const text = card.querySelector("h3");
  const paragraph = card.querySelector("p");

  if (icon) icon.style.transform = "translateX(0) translateY(0) translateZ(0)";
  if (text) text.style.transform = "translateX(0) translateY(0) translateZ(0)";
  if (paragraph)
    paragraph.style.transform = "translateX(0) translateY(0) translateZ(0)";
};

const handleLinkMouseMove = (e) => {
  const link = e.currentTarget;
  const rect = link.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  link.style.setProperty("--mouse-x", `${x}px`);
  link.style.setProperty("--mouse-y", `${y}px`);
};

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

  // Post items observer
  const postItems = document.querySelectorAll(".post-item");
  const postObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  postItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 100}ms`;
    postObserver.observe(item);
  });
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
        <div class="posts-list">
          <router-link
            v-for="post in latestPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            custom
            v-slot="{ navigate }"
          >
            <article class="post-item" @click="navigate" role="link">
              <div class="post-item-content">
                <header class="post-item-header">
                  <h3 class="post-item-title">{{ post.title }}</h3>
                  <div class="post-tags">
                    <span
                      v-for="(tag, index) in post.tags"
                      :key="index"
                      class="post-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </header>
                <p class="post-item-excerpt">{{ post.excerpt }}</p>
                <footer class="post-item-footer">
                  <span class="post-date">{{ post.date }}</span>
                  <div class="post-item-arrow">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 5L19 12L12 19"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </footer>
              </div>
              <div class="post-item-image-wrapper">
                <div class="post-item-image">
                  <img v-lazy="post.cover" :alt="post.title" />
                </div>
              </div>
            </article>
          </router-link>
        </div>
        <div class="view-all">
          <router-link
            to="/blog"
            class="view-all-link"
            @mousemove="handleLinkMouseMove"
          >
            <span>{{ t("home.latestPosts.viewAll") }}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
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
          <div
            class="tech-card"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
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
          <div
            class="tech-card"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
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
          <div
            class="tech-card"
            @mousemove="handleCardMouseMove"
            @mouseleave="handleCardMouseLeave"
          >
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

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.avatar-placeholder::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
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
  background-color: var(--color-background);
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 3rem;
  position: relative;
  display: block;
  text-align: left;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -0.75rem;
  left: 0;
  transform: translateX(0);
  width: 80px;
  height: 3px;
  background: var(--color-primary-gradient);
}

.posts-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 1.5rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease,
    opacity 0.5s ease;
  border-radius: var(--radius-lg);
  opacity: 0;
  transform: translateY(20px);
}

.post-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.post-item:first-child {
  border-top: 1px solid var(--color-border);
}

.post-item:hover {
  background-color: var(--color-secondary-background);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -10px rgba(var(--color-primary-rgb), 0.1);
}

.post-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-item-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.post-item-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  transition: color 0.3s ease;
}

.post-item:hover .post-item-title {
  color: var(--color-primary);
}

.post-item-excerpt {
  color: var(--color-secondary-text);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-item-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.post-date {
  color: var(--color-tertiary-text);
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.post-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-tag {
  color: var(--color-secondary-text);
  font-size: 0.875rem;
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  font-weight: 500;
}

.post-item-image-wrapper {
  width: 240px;
  flex-shrink: 0;
}

.post-item-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.post-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--bezier-smooth);
}

.post-item:hover .post-item-image img {
  transform: scale(1.05);
}

.post-item-arrow {
  color: var(--color-tertiary-text);
  opacity: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.post-item:hover .post-item-arrow {
  opacity: 1;
  transform: translateX(0);
}

.view-all {
  text-align: center;
  margin-top: 3rem;
}

.view-all-link {
  --transition-duration: 0.4s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-secondary-text);
  text-decoration: none;
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-full);
  transition: color var(--transition-duration) ease;
  background: transparent;
  z-index: 1;
}

.view-all-link:hover {
  color: var(--color-primary);
}

.view-all-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: radial-gradient(
    200px circle at var(--mouse-x) var(--mouse-y),
    rgba(var(--color-primary-rgb), 0.2) 0%,
    rgba(var(--color-accent-rgb), 0.15) 50%,
    transparent 80%
  );
  filter: blur(20px);
  opacity: 0;
  transition: opacity var(--transition-duration) ease;
  z-index: -1;
}

.view-all-link:hover::before {
  opacity: 1;
}

.view-all-link span,
.view-all-link svg {
  z-index: 1;
}

.view-all-link svg {
  transition: transform var(--transition-duration) ease;
  margin-left: 0.25rem;
}

.view-all-link:hover svg {
  transform: translateX(4px);
}

/* Tech Stack Section */
.tech-stack {
  padding: 3.5rem 0;
  background: var(--color-background);
  position: relative;
  overflow: hidden;
}

.tech-stack::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: radial-gradient(
    circle at 80% 20%,
    rgba(var(--color-primary-rgb), 0.05) 0%,
    transparent 50%
  );
  z-index: 0;
}

.tech-stack .container {
  position: relative;
  z-index: 1;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
}

.tech-card {
  padding: 1.25rem;
  border-radius: var(--radius-xl, 16px);
  text-align: center;
  transition:
    transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    background 0.3s ease,
    border-color 0.3s ease;
  position: relative;
  background: var(--color-secondary-background);
  border: 1px solid transparent;
  overflow: hidden;
  transform-style: preserve-3d;
}

.tech-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.03),
    transparent 35%
  );
  box-shadow: inset 0 0 30px rgba(var(--color-primary-rgb), 0.07);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.tech-card:hover::before {
  opacity: 1;
}

.tech-card:hover {
  background: linear-gradient(
    145deg,
    var(--color-tertiary-background),
    var(--color-secondary-background)
  );
  box-shadow: 0 20px 40px -15px rgba(var(--color-primary-rgb), 0.15);
}

.tech-icon,
.tech-card h3,
.tech-card p {
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
}

.tech-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  z-index: 1;
}

.tech-card:hover .tech-icon {
  background: rgba(var(--color-primary-rgb), 0.15);
  box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.2);
  transform: scale(1.1) rotate(-4deg);
  color: var(--color-primary-light);
}

.tech-card h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
}

.tech-card:hover h3 {
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tech-card p {
  color: var(--color-secondary-text);
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.tech-card:hover p {
  color: var(--color-text);
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .tech-card {
    padding: 1.25rem;
  }
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
  .post-item {
    flex-direction: column-reverse;
    align-items: stretch;
    padding: 1.5rem;
  }
  .post-item-content {
    flex: 1;
  }
  .post-item-image-wrapper {
    width: 100%;
    margin-bottom: 1.5rem;
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

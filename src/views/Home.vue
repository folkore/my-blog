<script setup>
import { ref, onMounted, onUnmounted, computed, reactive } from "vue";
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
const avatarScene = ref(null);
const particlesContainer = ref(null);
let observer = null;
let particlesInstance = null;
let typingInterval = null;

const techGridRef = ref(null);

const baseUrl = import.meta.env.BASE_URL;

// 技术栈数据
const techStack = reactive([
  {
    name: "Vue.js",
    icon: "vue.svg",
    radius: 120,
    speed: 16,
    delay: 0,
    direction: 1,
  },
  {
    name: "React",
    icon: "react.svg",
    radius: 160,
    speed: 20,
    delay: 2,
    direction: -1,
  },
  {
    name: "TypeScript",
    icon: "ts.svg",
    radius: 200,
    speed: 24,
    delay: 4,
    direction: 1,
  },
  {
    name: "JavaScript",
    icon: "js.svg",
    radius: 240,
    speed: 28,
    delay: 6,
    direction: -1,
  },
  {
    name: "CSS",
    icon: "css.svg",
    radius: 280,
    speed: 32,
    delay: 8,
    direction: 1,
  },
  {
    name: "HTML",
    icon: "html.svg",
    radius: 320,
    speed: 36,
    delay: 10,
    direction: -1,
  },
]);

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

  // 应用更流畅的3D变换
  heroAvatarRef.value.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  // 添加视差效果 - 头像周围元素的移动幅度更小
  const rings = heroAvatarRef.value.querySelectorAll(".avatar-ring");
  rings.forEach((ring, index) => {
    const factor = 0.7 - index * 0.2; // 不同环有不同的移动系数
    ring.style.transform = `perspective(1000px) rotateX(${tiltX * factor}deg) rotateY(${tiltY * factor}deg)`;
  });
});

const resetAvatarTilt = () => {
  if (heroAvatarRef.value) {
    heroAvatarRef.value.style.transform = "";

    // 重置所有环的变换
    const rings = heroAvatarRef.value.querySelectorAll(".avatar-ring");
    rings.forEach((ring) => {
      ring.style.transform = "";
    });
  }
};

// 粒子背景创建函数
const createParticlesBackground = () => {
  if (!particlesContainer.value) return;

  const container = particlesContainer.value;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // 清除现有粒子
  container.innerHTML = "";

  // 创建新粒子
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // 随机位置
    const x = Math.random() * containerWidth;
    const y = Math.random() * containerHeight;

    // 随机大小
    const size = Math.random() * 4 + 1;

    // 随机透明度
    const opacity = Math.random() * 0.5 + 0.1;

    // 随机动画延迟
    const animationDelay = Math.random() * 5;

    // 随机动画持续时间
    const animationDuration = Math.random() * 20 + 15;

    // 设置样式
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.opacity = opacity;
    particle.style.animationDelay = `${animationDelay}s`;
    particle.style.animationDuration = `${animationDuration}s`;

    container.appendChild(particle);
  }
};

// 打字机效果
const initTypingEffect = () => {
  const typingText = document.querySelector(".typing-text");
  const texts = ["思考者", "探索者", "记录者", "创造者"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const type = () => {
    const currentText = texts[textIndex];

    if (isDeleting) {
      // 删除文字
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // 删除速度更快
    } else {
      // 输入文字
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150; // 输入速度较慢
    }

    // 如果已完成当前词的输入
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1500; // 输入完成后暂停一段时间
    }
    // 如果已删除完当前词
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length; // 循环切换文字
      typingSpeed = 500; // 切换到下一个词之前暂停
    }

    // 设置下一个字符的输入/删除
    setTimeout(type, typingSpeed);
  };

  // 启动打字效果
  if (typingText) {
    setTimeout(type, 1000); // 页面加载1秒后开始
  }
};

// 滚动指示器效果
const initScrollIndicator = () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      // 当页面滚动超过一定高度时隐藏指示器
      if (window.scrollY > 100) {
        scrollIndicator.classList.add("hidden");
      } else {
        scrollIndicator.classList.remove("hidden");
      }
    });

    // 点击滚动指示器平滑滚动到下一部分
    scrollIndicator.addEventListener("click", () => {
      const heroHeight = document.querySelector(".hero").offsetHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    });
  }
};

// 初始化3D场景
const init3DScene = () => {
  if (avatarScene.value) {
    // 这里可以添加WebGL或Three.js的初始化代码
    // 或者使用CSS 3D变换模拟3D效果
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

  // 初始化新增功能
  createParticlesBackground();
  initTypingEffect();
  initScrollIndicator();
  init3DScene();

  // 窗口大小变化时重新计算粒子背景
  window.addEventListener(
    "resize",
    throttle(() => {
      createParticlesBackground();
    }, 200)
  );
});

onUnmounted(() => {
  // 组件卸载时停止观察，清理资源
  if (observer && heroAvatarRef.value) {
    observer.unobserve(heroAvatarRef.value);
  }

  // 清理事件监听
  window.removeEventListener("resize", createParticlesBackground);

  // 清理定时器
  if (typingInterval) {
    clearInterval(typingInterval);
  }
});
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-shape hero-shape-1"></div>
        <div class="hero-shape hero-shape-2"></div>
        <div class="hero-shape hero-shape-3"></div>
        <div class="hero-particles" ref="particlesContainer"></div>
      </div>
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-headline">
            <h1
              class="hero-title glitch-text"
              data-text="在名为'我'的深海，投下一枚石子。"
            >
              在名为'我'的深海，投下一枚石子。
            </h1>
            <div class="hero-subtitle">
              <span class="typing-text"></span>
              <span class="typing-cursor">|</span>
            </div>
          </div>
          <p class="hero-description">
            你好，岸上的人。我是
            <span class="brand-name">folklore</span
            >。<br />我时常潜入名为"自我"的静寂深海，投下一枚名为"思考"的石子，只为观察那荡开的，名为"理解"的涟漪。这里陈列的，便是我拾起的，一些被浪花冲刷上岸的贝壳。<br />若你恰好路过，愿其中一枚，能让你听见海的声音。
          </p>
          <div class="hero-buttons">
            <router-link to="/blog" class="hero-button primary">
              <span class="button-text">进入博客</span>
              <span class="button-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </span>
            </router-link>
            <router-link to="/about" class="hero-button secondary">
              <span class="button-text">关于我</span>
              <span class="button-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </span>
            </router-link>
          </div>
          <div class="hero-social">
            <a
              href="https://github.com"
              target="_blank"
              class="social-link"
              title="GitHub"
            >
              <span class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </span>
              <span class="social-hover-text">GitHub</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              class="social-link"
              title="Twitter"
            >
              <span class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </span>
              <span class="social-hover-text">Twitter</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              class="social-link"
              title="LinkedIn"
            >
              <span class="social-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </span>
              <span class="social-hover-text">LinkedIn</span>
            </a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="avatar-scene" ref="avatarScene">
            <div
              class="avatar-container"
              :class="{ loading: !avatarLoaded }"
              ref="heroAvatarRef"
              @mousemove="handleAvatarMove"
              @mouseleave="resetAvatarTilt"
            >
              <div class="avatar-ring"></div>
              <div class="avatar-ring ring-2"></div>
              <div class="avatar-ring ring-3"></div>

              <div class="avatar-frame">
                <div v-if="!avatarLoaded" class="avatar-placeholder">
                  <div class="avatar-loader"></div>
                </div>
                <img
                  v-if="avatarUrl"
                  :src="avatarUrl"
                  alt="头像"
                  class="avatar-image"
                  :class="{ loaded: avatarLoaded }"
                  @load="avatarLoaded = true"
                />
                <div class="avatar-glow"></div>
              </div>

              <div class="tech-universe">
                <div class="tech-galaxy">
                  <div
                    v-for="(tech, idx) in techStack"
                    :key="idx"
                    class="tech-star"
                    :style="{
                      '--orbit-radius': `${tech.radius}px`,
                      '--orbit-speed': `${tech.speed}s`,
                      '--orbit-delay': `${tech.delay}s`,
                      '--orbit-direction': tech.direction,
                    }"
                  >
                    <div class="tech-planet">
                      <img
                        :src="`${baseUrl}tech-icons/${tech.icon}`"
                        :alt="tech.name"
                      />
                      <div class="tech-tooltip">{{ tech.name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="scroll-indicator">
        <div class="scroll-text">向下滚动</div>
        <div class="scroll-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
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
  padding: 0;
  overflow: hidden;
  background: var(--color-secondary-background);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-container {
  display: flex;
  align-items: center;
  gap: 4rem;
  width: 100%;
  position: relative;
  z-index: 5;
}

/* 背景效果 */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.hero-shape-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-rgb), 0.3),
    rgba(var(--color-primary-rgb), 0.1) 60%,
    transparent 70%
  );
  top: -200px;
  right: -200px;
}

.hero-shape-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(var(--color-accent-rgb), 0.2),
    rgba(var(--color-accent-rgb), 0.1) 60%,
    transparent 70%
  );
  bottom: -150px;
  left: -150px;
}

.hero-shape-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-light-rgb), 0.15),
    rgba(var(--color-primary-light-rgb), 0.05) 60%,
    transparent 70%
  );
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 粒子效果 */
.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2;
}

.particle {
  position: absolute;
  background: linear-gradient(
    180deg,
    rgba(var(--color-primary-rgb), 0.8),
    rgba(var(--color-accent-rgb), 0.8)
  );
  border-radius: 50%;
  pointer-events: none;
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

/* 内容区域 */
.hero-content {
  flex: 1 1 55%;
  position: relative;
  z-index: 3;
  text-align: left;
  max-width: 650px;
}

.hero-headline {
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-light) 50%,
    var(--color-accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
  animation: fadeInUp 0.8s ease-out;
}

/* 故障艺术文字效果 */
.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-light) 50%,
    var(--color-accent) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.glitch-text::before {
  animation: glitch-animation 3s infinite linear alternate-reverse;
  left: 2px;
  text-shadow: -1px 0 rgba(var(--color-primary-rgb), 0.3);
  clip-path: polygon(
    0 0,
    100% 0,
    100% 35%,
    0 35%,
    0 45%,
    100% 45%,
    100% 85%,
    0 85%,
    0 100%,
    100% 100%
  );
}

.glitch-text::after {
  animation: glitch-animation 2s infinite linear alternate-reverse;
  left: -2px;
  text-shadow: 1px 0 rgba(var(--color-accent-rgb), 0.3);
  clip-path: polygon(
    0 25%,
    100% 25%,
    100% 30%,
    0 30%,
    0 50%,
    100% 50%,
    100% 70%,
    0 70%,
    0 80%,
    100% 80%
  );
}

@keyframes glitch-animation {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-1px, 1px);
  }
  40% {
    transform: translate(-1px, -1px);
  }
  60% {
    transform: translate(1px, 1px);
  }
  80% {
    transform: translate(1px, -1px);
  }
  100% {
    transform: translate(0);
  }
}

/* 打字机效果区域 */
.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  height: 2rem;
  display: flex;
  align-items: center;
  color: var(--color-primary-light);
  margin-top: 0.5rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.typing-text {
  display: inline-block;
}

.typing-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: cursor-blink 1s infinite;
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.hero-description {
  font-size: 1.1rem;
  color: var(--color-secondary-text);
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.8s ease-out 0.4s both;
  line-height: 1.8;
}

.brand-name {
  position: relative;
  color: var(--color-primary);
  font-weight: 600;
  display: inline-block;
  padding: 0 4px;
}

.brand-name::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    rgba(var(--color-primary-rgb), 0.3),
    rgba(var(--color-accent-rgb), 0.3)
  );
  border-radius: 2px;
}

/* 按钮样式 */
.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.hero-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  z-index: 1;
}

.button-text {
  position: relative;
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.button-icon {
  position: relative;
  z-index: 2;
  width: 20px;
  height: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0.8;
}

.hero-button.primary {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-primary-light) 100%
  );
  color: white;
  box-shadow: 0 10px 20px -10px rgba(var(--color-primary-rgb), 0.5);
}

.hero-button.primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--color-primary-light) 0%,
    var(--color-primary) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.hero-button.primary:hover::before {
  opacity: 1;
}

.hero-button.secondary {
  background: rgba(var(--color-tertiary-background-rgb), 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--color-text);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
}

.hero-button.secondary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(var(--color-primary-rgb), 0.05);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.hero-button.secondary:hover::before {
  opacity: 1;
}

.hero-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(var(--color-primary-rgb), 0.3);
}

.hero-button:hover .button-icon {
  transform: translateX(4px);
}

/* 社交链接 */
.hero-social {
  display: flex;
  gap: 1.5rem;
  justify-content: flex-start;
  margin-top: 3rem;
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.social-link {
  position: relative;
  color: var(--color-secondary-text);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(var(--color-tertiary-background-rgb), 0.5);
  border: 1px solid rgba(var(--color-border-rgb), 0.2);
  overflow: hidden;
}

.social-icon {
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-hover-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1;
}

.social-link:hover {
  color: var(--color-primary);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px -5px rgba(var(--color-primary-rgb), 0.2);
}

.social-link:hover .social-icon {
  transform: translateY(-120%);
}

.social-link:hover .social-hover-text {
  opacity: 1;
  transform: translateY(0);
}

/* 视觉区域 */
.hero-visual {
  flex: 1 1 45%;
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 450px;
}

.avatar-scene {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
}

.avatar-container {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 0;
  border-radius: 50%;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform;
  transform-style: preserve-3d;
  animation: avatarFloat 6s ease-in-out infinite;
}

@keyframes avatarFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.avatar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(var(--color-primary-rgb), 0.1);
  box-shadow: 0 0 30px rgba(var(--color-primary-rgb), 0.1);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  animation: ringRotate 20s linear infinite;
}

.ring-2 {
  width: calc(100% + 80px);
  height: calc(100% + 80px);
  border: 2px solid rgba(var(--color-accent-rgb), 0.1);
  animation-duration: 25s;
  animation-direction: reverse;
}

.ring-3 {
  width: calc(100% + 120px);
  height: calc(100% + 120px);
  border: 2px solid rgba(var(--color-primary-light-rgb), 0.1);
  animation-duration: 30s;
}

@keyframes ringRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.avatar-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(var(--color-secondary-background-rgb), 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(var(--color-border-rgb), 0.2);
  box-shadow:
    0 20px 50px -20px rgba(var(--color-primary-rgb), 0.4),
    inset 0 0 30px rgba(var(--color-primary-rgb), 0.1);
  transform-style: preserve-3d;
  z-index: 2;
}

.avatar-placeholder {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    120deg,
    var(--color-secondary-background) 30%,
    rgba(var(--color-primary-rgb), 0.1) 50%,
    var(--color-secondary-background) 70%
  );
  background-size: 200% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shimmer 1.5s infinite;
}

.avatar-loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid rgba(var(--color-primary-rgb), 0.1);
  border-top-color: var(--color-primary);
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.8s ease;
  z-index: 2;
}

.avatar-image.loaded {
  opacity: 1;
}

.avatar-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(var(--color-primary-rgb), 0.3) 0%,
    transparent 70%
  );
  filter: blur(15px);
  opacity: 0.6;
  z-index: 1;
  animation: glowPulse 4s ease-in-out infinite alternate;
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

/* 技术星系 */
.tech-universe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  z-index: 3;
}

.tech-galaxy {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  animation: galaxyRotate 60s linear infinite;
}

@keyframes galaxyRotate {
  0% {
    transform: translate(-50%, -50%) rotateY(0deg) rotateX(65deg);
  }
  100% {
    transform: translate(-50%, -50%) rotateY(360deg) rotateX(65deg);
  }
}

.tech-star {
  position: absolute;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  animation: starOrbit linear infinite;
  animation-duration: var(--orbit-speed);
  animation-delay: var(--orbit-delay);
  animation-direction: var(--orbit-direction);
}

@keyframes starOrbit {
  0% {
    transform: rotateY(0deg) translateX(var(--orbit-radius)) rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg) translateX(var(--orbit-radius)) rotateY(-360deg);
  }
}

.tech-planet {
  width: 50px;
  height: 50px;
  background: var(--color-secondary-background);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.3s ease;
  animation: planetPulse 3s ease-in-out infinite;
  animation-delay: calc(var(--orbit-delay) * 0.5s);
}

.tech-planet img {
  width: 28px;
  height: 28px;
  transition: transform 0.3s ease;
}

.tech-planet:hover {
  transform: scale(1.2);
  box-shadow: 0 10px 25px rgba(var(--color-primary-rgb), 0.3);
}

.tech-planet:hover img {
  transform: rotate(20deg);
}

@keyframes planetPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.tech-tooltip {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(var(--color-secondary-background-rgb), 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  white-space: nowrap;
  color: var(--color-text);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
  pointer-events: none;
}

.tech-planet:hover .tech-tooltip {
  opacity: 1;
  visibility: visible;
  bottom: -40px;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-secondary-text);
  opacity: 0.7;
  transition: all 0.5s ease;
  z-index: 10;
  cursor: pointer;
  animation:
    fadeInUp 0.8s ease-out 1.2s both,
    bounce 2s ease-in-out infinite 2s;
}

.scroll-indicator.hidden {
  opacity: 0;
  transform: translate(-50%, 20px);
  pointer-events: none;
}

.scroll-text {
  font-size: 0.9rem;
  margin-bottom: 5px;
  font-weight: 500;
}

.scroll-arrow {
  width: 24px;
  height: 24px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-container {
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .avatar-container {
    width: 280px;
    height: 280px;
  }

  .tech-planet {
    width: 45px;
    height: 45px;
  }

  .tech-planet img {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 992px) {
  .hero-container {
    flex-direction: column;
    padding-top: 5rem;
    padding-bottom: 5rem;
    text-align: center;
  }

  .hero-content {
    max-width: 100%;
    text-align: center;
  }

  .hero-buttons,
  .hero-social {
    justify-content: center;
  }

  .hero-visual {
    margin-top: 3rem;
  }

  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
    height: 1.6rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .avatar-container {
    width: 240px;
    height: 240px;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .hero-button {
    width: 100%;
  }

  .tech-star {
    --orbit-radius: calc(var(--orbit-radius) * 0.7);
  }

  .tech-planet {
    width: 40px;
    height: 40px;
  }

  .tech-planet img {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 576px) {
  .hero-container {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-social {
    gap: 1rem;
  }

  .social-link {
    width: 40px;
    height: 40px;
  }

  .avatar-container {
    width: 200px;
    height: 200px;
  }
}

/* 其他原有样式 */
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
  .hero-container {
    flex-direction: column;
    text-align: center;
  }
  .hero-content {
    flex-basis: auto;
    text-align: center;
  }
  .hero-visual {
    flex-basis: auto;
    margin-top: 3rem;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-buttons,
  .hero-social {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 0;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-description {
    font-size: 1rem;
  }
  .hero-avatar {
    width: 220px;
    height: 220px;
  }
  .tech-planet {
    --radius: 140px;
    width: 45px;
    height: 45px;
  }
  .tech-planet img {
    width: 24px;
    height: 24px;
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

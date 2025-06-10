<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isDarkTheme = ref(false);
const isScrolled = ref(false);

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value;
  document.documentElement.classList.toggle("dark-theme");
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  // 检查系统主题偏好
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    isDarkTheme.value = true;
    document.documentElement.classList.add("dark-theme");
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="app" :class="{ 'dark-theme': isDarkTheme }">
    <!-- 导航栏 -->
    <header class="header" :class="{ 'header-scrolled': isScrolled }">
      <nav class="nav container">
        <router-link to="/" class="nav-brand">
          <span class="brand-text">MyBlog</span>
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link" active-class="nav-link-active"
            >首页</router-link
          >
          <router-link
            to="/blog"
            class="nav-link"
            active-class="nav-link-active"
            >博客</router-link
          >
          <router-link
            to="/about"
            class="nav-link"
            active-class="nav-link-active"
            >关于</router-link
          >
          <router-link
            to="/contact"
            class="nav-link"
            active-class="nav-link-active"
            >联系我</router-link
          >
        </div>
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :title="isDarkTheme ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <span class="theme-icon" :class="{ 'theme-icon-dark': isDarkTheme }">
            {{ isDarkTheme ? "🌙" : "☀️" }}
          </span>
        </button>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>MyBlog</h3>
            <p>分享技术，探索创新</p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>导航</h4>
              <router-link to="/">首页</router-link>
              <router-link to="/blog">博客</router-link>
              <router-link to="/about">关于</router-link>
              <router-link to="/contact">联系我</router-link>
            </div>
            <div class="footer-section">
              <h4>联系方式</h4>
              <a href="mailto:contact@myblog.com">Email</a>
              <a href="https://github.com" target="_blank">GitHub</a>
              <a href="https://twitter.com" target="_blank">Twitter</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 MyBlog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* CSS 变量定义 */
:root {
  /* 主色调 */
  --color-primary: #2563eb;
  --color-primary-light: #3b82f6;
  --color-primary-dark: #1d4ed8;

  /* 背景色 */
  --color-background: #ffffff;
  --color-secondary-background: #f8fafc;
  --color-tertiary-background: #f1f5f9;

  /* 文本色 */
  --color-text: #1e293b;
  --color-secondary-text: #64748b;
  --color-tertiary-text: #94a3b8;

  /* 边框和阴影 */
  --color-border: #e2e8f0;
  --color-shadow: rgba(15, 23, 42, 0.08);
  --color-shadow-lg: rgba(15, 23, 42, 0.12);

  /* 状态颜色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* 布局 */
  --header-height: 64px;
  --content-width: 1200px;

  /* 动画 */
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

.dark-theme {
  --color-primary: #3b82f6;
  --color-primary-light: #60a5fa;
  --color-primary-dark: #2563eb;

  --color-background: #0f172a;
  --color-secondary-background: #1e293b;
  --color-tertiary-background: #334155;

  --color-text: #f8fafc;
  --color-secondary-text: #cbd5e1;
  --color-tertiary-text: #94a3b8;

  --color-border: #334155;
  --color-shadow: rgba(0, 0, 0, 0.3);
  --color-shadow-lg: rgba(0, 0, 0, 0.4);
}

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color var(--transition-normal) ease;
}

.container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 24px;
}

/* 应用布局 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 头部导航样式 */
.header {
  height: var(--header-height);
  background-color: rgba(var(--color-background-rgb), 0.8);
  border-bottom: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all var(--transition-normal) ease;
}

.header-scrolled {
  background-color: var(--color-background);
  box-shadow: 0 4px 6px -1px var(--color-shadow);
}

.nav {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-light)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity var(--transition-normal) ease;
}

.nav-brand:hover .brand-text {
  opacity: 0.9;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-secondary-text);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal) ease;
  position: relative;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: all var(--transition-normal) ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link-active {
  color: var(--color-primary);
}

.nav-link-active::after {
  width: 100%;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-md);
  color: var(--color-text);
  transition: all var(--transition-normal) ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background-color: var(--color-tertiary-background);
  transform: scale(1.05);
}

.theme-icon {
  font-size: 1.25rem;
  transition: transform var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon-dark {
  transform: rotate(360deg);
}

/* 主要内容区域 */
.main {
  flex: 1;
  margin-top: var(--header-height);
  background-color: var(--color-background);
  position: relative;
  z-index: 1;
}

/* 页脚样式 */
.footer {
  background-color: var(--color-secondary-background);
  padding: 4rem 0 2rem;
  border-top: 1px solid var(--color-border);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-light)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.footer-brand p {
  color: var(--color-secondary-text);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.footer-section a {
  display: block;
  color: var(--color-secondary-text);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color var(--transition-normal) ease;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-tertiary-text);
  font-size: 0.875rem;
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--transition-normal) ease,
    transform var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 16px;
  }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-tertiary-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-secondary-text);
  border-radius: var(--radius-md);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
</style>

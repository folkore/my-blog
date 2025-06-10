<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useTheme } from "./composables/useTheme";
import BackToTop from "./components/BackToTop.vue";
import ReadingProgress from "./components/ReadingProgress.vue";
import PageTransition from "./components/PageTransition.vue";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
import { useI18n } from "vue-i18n";

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const { themeMode, currentTheme, toggleTheme, cleanup, THEME } = useTheme();
const { t, locale } = useI18n();

// 监听语言变化，更新导航项
const updateNavItems = () => {
  navItems.value = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];
};

// 将导航项改为响应式
const navItems = ref([
  { name: t("nav.home"), path: "/" },
  { name: t("nav.blog"), path: "/blog" },
  { name: t("nav.about"), path: "/about" },
  { name: t("nav.contact"), path: "/contact" },
]);

// 监听语言变化
watch(locale, () => {
  updateNavItems();
});

// 监听语言变化事件
const handleLanguageChanged = () => {
  updateNavItems();
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.style.overflow = isMenuOpen.value ? "hidden" : "";
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("language-changed", handleLanguageChanged);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("language-changed", handleLanguageChanged);
  cleanup(); // 清理主题相关的事件监听
});
</script>

<template>
  <div class="app" :class="{ 'dark-theme': themeMode === THEME.DARK }">
    <!-- 阅读进度条 -->
    <ReadingProgress />

    <!-- 导航栏 -->
    <header class="header" :class="{ 'header-scrolled': isScrolled }">
      <nav class="nav container">
        <router-link to="/" class="nav-brand">
          <div class="brand-logo">M</div>
          <span class="brand-text">MyBlog</span>
        </router-link>

        <div class="nav-menu" :class="{ 'nav-menu-active': isMenuOpen }">
          <div class="nav-links">
            <router-link
              v-for="(item, index) in navItems"
              :key="`${item.path}-${locale}`"
              :to="item.path"
              class="nav-link"
              active-class="nav-link-active"
              @click="isMenuOpen = false"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <div class="nav-right">
          <LanguageSwitcher class="nav-language" />
          <button
            class="theme-toggle"
            @click="toggleTheme"
            :title="
              themeMode === THEME.LIGHT
                ? '切换到暗色模式'
                : themeMode === THEME.DARK
                ? '切换到跟随系统'
                : '切换到亮色模式'
            "
          >
            <span
              class="theme-icon"
              :class="{ 'theme-icon-dark': currentTheme === THEME.DARK }"
            >
              <!-- 暗色模式图标 -->
              <svg
                v-if="currentTheme === THEME.DARK"
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
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                ></path>
              </svg>
              <!-- 亮色模式图标 -->
              <svg
                v-else-if="themeMode === THEME.LIGHT"
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
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <!-- 系统主题图标 -->
              <svg
                v-else
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
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </span>
          </button>
          <button
            class="menu-toggle"
            @click="toggleMenu"
            :class="{ 'menu-active': isMenuOpen }"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <router-view v-slot="{ Component, route }">
        <PageTransition :name="route.meta.transition || 'page'">
          <component :is="Component" :key="route.path" />
        </PageTransition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="brand-logo">M</div>
              <h3>MyBlog</h3>
            </div>
            <p>探索技术的无限可能</p>
            <div class="social-links">
              <a href="https://github.com" target="_blank" class="social-link">
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
                  <path
                    d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                  ></path>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" class="social-link">
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
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>导航</h4>
              <router-link
                v-for="(item, index) in navItems"
                :key="index"
                :to="item.path"
                class="footer-link"
              >
                {{ item.name }}
              </router-link>
            </div>
            <div class="footer-section">
              <h4>联系我</h4>
              <a href="mailto:contact@myblog.com" class="footer-link">Email</a>
              <a href="#" class="footer-link">RSS</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>
            &copy; {{ new Date().getFullYear() }} MyBlog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- 返回顶部按钮 -->
    <BackToTop />
  </div>
</template>

<style>
/* CSS 变量定义 */
:root {
  /* 主色调 */
  --color-primary: #0066ff;
  --color-primary-light: #3385ff;
  --color-primary-dark: #0047b3;
  --color-primary-gradient: linear-gradient(135deg, #0066ff, #3385ff);
  --color-accent: #00d4ff;
  --color-accent-gradient: linear-gradient(135deg, #00d4ff, #0066ff);

  /* 背景色 */
  --color-background: #ffffff;
  --color-secondary-background: #f8fafc;
  --color-tertiary-background: #f1f5f9;
  --color-glass-background: rgba(255, 255, 255, 0.85);
  --color-glass-background-dark: rgba(255, 255, 255, 0.05);

  /* 文本色 */
  --color-text: #1e293b;
  --color-secondary-text: #64748b;
  --color-tertiary-text: #94a3b8;

  /* 边框和阴影 */
  --color-border: rgba(226, 232, 240, 0.8);
  --color-shadow: rgba(15, 23, 42, 0.08);
  --color-shadow-lg: rgba(15, 23, 42, 0.12);
  --shadow-sm: 0 1px 2px 0 var(--color-shadow);
  --shadow-md: 0 4px 6px -1px var(--color-shadow),
    0 2px 4px -2px var(--color-shadow);
  --shadow-lg: 0 10px 15px -3px var(--color-shadow),
    0 4px 6px -4px var(--color-shadow);
  --shadow-xl: 0 20px 25px -5px var(--color-shadow-lg),
    0 8px 10px -6px var(--color-shadow);
  --shadow-inner: inset 0 2px 4px 0 var(--color-shadow);
  --shadow-glow: 0 0 15px var(--color-primary);

  /* 布局 */
  --header-height: 72px;
  --content-width: 1200px;
  --nav-link-size: 0.875rem;

  /* 动画 */
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
  --bezier-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --bezier-smooth: cubic-bezier(0.4, 0, 0.2, 1);

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* 模糊 */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 12px;
}

.dark-theme {
  --color-primary: #3385ff;
  --color-primary-light: #66a3ff;
  --color-primary-dark: #0066ff;
  --color-accent: #00d4ff;

  --color-background: #0f172a;
  --color-secondary-background: #1e293b;
  --color-tertiary-background: #334155;
  --color-glass-background: rgba(15, 23, 42, 0.85);
  --color-glass-background-dark: rgba(15, 23, 42, 0.95);

  --color-text: #f8fafc;
  --color-secondary-text: #cbd5e1;
  --color-tertiary-text: #94a3b8;

  --color-border: rgba(51, 65, 85, 0.8);
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
  transition: background-color var(--transition-normal) var(--bezier-smooth);
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
  background-color: var(--color-glass-background);
  border-bottom: 1px solid var(--color-border);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(var(--blur-lg));
  -webkit-backdrop-filter: blur(var(--blur-lg));
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.header-scrolled {
  background-color: var(--color-glass-background-dark);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(var(--blur-lg)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(180%);
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
  gap: 16px;
  position: relative;
}

.brand-logo {
  width: 40px;
  height: 40px;
  background: var(--color-primary-gradient);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal) var(--bezier-bounce);
}

.brand-logo::before {
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

.nav-brand:hover .brand-logo {
  transform: scale(1.1) rotate(-4deg);
  box-shadow: var(--shadow-glow);
}

.nav-brand:hover .brand-logo::before {
  transform: translateX(100%);
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--color-accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: opacity var(--transition-normal) ease;
  position: relative;
}

.brand-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(4px);
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.nav-brand:hover .brand-text::after {
  opacity: 0.5;
  transform: translateY(0);
}

.nav-menu {
  position: relative;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-secondary-text);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--nav-link-size);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  transition: all var(--transition-normal) var(--bezier-smooth);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-primary);
  opacity: 0;
  transform: translateY(100%);
  transition: all var(--transition-normal) var(--bezier-smooth);
  z-index: -1;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link:hover::before {
  opacity: 0.1;
  transform: translateY(0);
}

.nav-link-active {
  color: white;
  background: var(--color-primary-gradient);
  box-shadow: var(--shadow-md);
}

.nav-link-active:hover::before {
  opacity: 0.2;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-full);
  color: var(--color-text);
  transition: all var(--transition-normal) var(--bezier-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.theme-toggle::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-primary);
  opacity: 0;
  transform: scale(0);
  transition: all var(--transition-normal) var(--bezier-bounce);
  z-index: -1;
}

.theme-toggle:hover {
  color: white;
  transform: scale(1.05);
}

.theme-toggle:hover::before {
  opacity: 1;
  transform: scale(1);
}

.theme-icon {
  transition: transform var(--transition-normal) var(--bezier-bounce);
}

.theme-icon svg {
  transition: all var(--transition-normal) var(--bezier-bounce);
}

.theme-toggle:hover svg {
  transform: scale(1.1);
}

.theme-icon-dark {
  transform: rotate(360deg);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-direction: column;
  gap: 6px;
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  transition: all var(--transition-normal) var(--bezier-smooth);
  transform-origin: center;
}

.menu-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.menu-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
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
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-primary-gradient);
  opacity: 0.3;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
  position: relative;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo h3 {
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--color-secondary-text);
  padding: 10px;
  border-radius: var(--radius-full);
  transition: all var(--transition-normal) var(--bezier-bounce);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-tertiary-background);
  position: relative;
  overflow: hidden;
}

.social-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-normal) var(--bezier-smooth);
}

.social-link svg {
  position: relative;
  z-index: 1;
  transition: all var(--transition-normal) var(--bezier-bounce);
}

.social-link:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.social-link:hover::before {
  opacity: 1;
}

.social-link:hover svg {
  transform: scale(1.1);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  position: relative;
  display: inline-block;
}

.footer-section h4::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 2rem;
  height: 2px;
  background: var(--color-primary-gradient);
}

.footer-link {
  display: block;
  color: var(--color-secondary-text);
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: all var(--transition-normal) var(--bezier-bounce);
  position: relative;
  width: fit-content;
}

.footer-link::before {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-primary-gradient);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--transition-normal) var(--bezier-smooth);
}

.footer-link:hover {
  color: var(--color-primary);
  transform: translateX(4px);
}

.footer-link:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
  color: var(--color-tertiary-text);
  font-size: 0.875rem;
  position: relative;
}

.footer-bottom::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 1px;
  background: var(--color-primary-gradient);
  opacity: 0.3;
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: opacity var(--transition-normal) var(--bezier-smooth),
    transform var(--transition-normal) var(--bezier-bounce);
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
  .nav-menu {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-glass-background);
    backdrop-filter: blur(var(--blur-lg));
    -webkit-backdrop-filter: blur(var(--blur-lg));
    padding: 2rem;
    transform: translateX(100%);
    transition: transform var(--transition-normal) var(--bezier-smooth);
    overflow-y: auto;
  }

  .nav-menu-active {
    transform: translateX(0);
  }

  .nav-links {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-link {
    font-size: 1.25rem;
    padding: 1rem;
    text-align: center;
    background: var(--color-tertiary-background);
  }

  .nav-link-active {
    transform: scale(1.05);
  }

  .menu-toggle {
    display: flex;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
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

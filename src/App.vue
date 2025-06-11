<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useTheme } from "./composables/useTheme";
import BackToTop from "./components/BackToTop.vue";
import ReadingProgress from "./components/ReadingProgress.vue";
import PageTransition from "./components/PageTransition.vue";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
import GlobalSearch from "./components/GlobalSearch.vue";
import AppFooter from "./components/AppFooter.vue";
import { useI18n } from "vue-i18n";
import { usePostsStore } from "./store/index.js";

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const { themeMode, currentTheme, toggleTheme, cleanup, THEME } = useTheme();
const { t, locale } = useI18n();
const postsStore = usePostsStore();

const navItems = ref([]);

const updateNavItems = () => {
  navItems.value = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];
};

watch(locale, updateNavItems, { immediate: true });

const handleLanguageChanged = () => {
  updateNavItems();
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.classList.toggle("no-scroll", isMenuOpen.value);
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty(
    "--scrollbar-width",
    `${scrollbarWidth}px`
  );

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("language-changed", handleLanguageChanged);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("language-changed", handleLanguageChanged);
  document.body.classList.remove("no-scroll");
  cleanup();
});
</script>

<template>
  <div class="app" :class="{ 'dark-theme': themeMode === THEME.DARK }">
    <ReadingProgress />

    <header class="header" :class="{ 'header-scrolled': isScrolled }">
      <nav class="nav container">
        <div class="nav-brand">
          <router-link to="/" class="nav-brand">
            <div class="logo">M</div>
            <span class="brand-name">{{ t("brand.name") }}</span>
          </router-link>
        </div>

        <div class="nav-menu" :class="{ 'nav-menu-active': isMenuOpen }">
          <div class="nav-links">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === item.path }"
              @click="isMenuOpen = false"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <div class="nav-right">
          <button
            class="search-btn"
            @click="$refs.globalSearch.openSearch()"
            :aria-label="t('search.button')"
          >
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>{{ t("search.button") }}</span>
            <span class="kbd-shortcut">
              <kbd>Ctrl</kbd><span>+</span><kbd>K</kbd>
            </span>
          </button>
          <LanguageSwitcher class="desktop-lang" />
          <button
            class="theme-toggle desktop-theme"
            @click="toggleTheme"
            :title="t('theme.toggle')"
          >
            <span
              class="theme-icon"
              :class="{ 'theme-icon-dark': currentTheme === THEME.DARK }"
            >
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

    <main class="main">
      <router-view v-slot="{ Component, route }">
        <PageTransition :name="route.meta.transition || 'page'">
          <component :is="Component" :key="route.path" />
        </PageTransition>
      </router-view>
    </main>

    <AppFooter :is-dark="themeMode === THEME.DARK" />

    <BackToTop />
    <GlobalSearch
      ref="globalSearch"
      :posts="postsStore.posts"
      :hideButton="true"
    />
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

  /* 添加 CSS 变量 */
  --color-primary-rgb: 0, 102, 255;
  --color-accent-rgb: 0, 212, 255;
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
  gap: 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.75rem;
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-gradient);
  background-size: 150% 150%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  transition: all var(--transition-slow) var(--bezier-smooth);
  animation: gradient-calm 8s ease infinite;
}

.nav-brand:hover .logo {
  transform: translateY(-4px) scale(1.1);
  box-shadow: var(--shadow-xl);
  animation-duration: 3s;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.025em;
}

.nav-menu {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: space-between;
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
  white-space: nowrap;
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

.desktop-search,
.desktop-lang,
.desktop-theme {
  display: flex;
}

.nav-actions {
  display: none;
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

@keyframes gradient-calm {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav {
    padding: 0 1rem;
  }

  .brand-name {
    font-size: 1rem;
  }

  .logo {
    width: 28px;
    height: 28px;
    font-size: 16px;
  }

  .search-btn {
    padding: 0.3rem 0.5rem;
  }

  .search-btn span:not(.kbd-shortcut) {
    display: none;
  }

  .nav-menu {
    display: none;
    opacity: 0;
    transform: translateY(-20px);
  }

  .nav-menu-active {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    height: calc(100vh - var(--header-height));
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px) saturate(200%);
    -webkit-backdrop-filter: blur(25px) saturate(200%);
    padding: 2rem 1.5rem;
    opacity: 1;
    transform: translateY(0);
    transition: all var(--transition-normal) cubic-bezier(0.65, 0, 0.35, 1);
    overflow-y: auto;
    align-items: center;
    justify-content: flex-start;
    gap: 2rem;
    z-index: 999;
  }

  .dark-theme .nav-menu-active {
    background: rgba(15, 23, 42, 0.95);
  }

  .nav-menu-active::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at 100% 0%,
        rgba(var(--color-primary-rgb), 0.15) 0%,
        transparent 25%
      ),
      radial-gradient(
        circle at 0% 100%,
        rgba(var(--color-accent-rgb), 0.15) 0%,
        transparent 25%
      );
    pointer-events: none;
    opacity: 0.5;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    gap: 1rem;
    padding: 0;
    position: relative;
  }

  .nav-link {
    font-size: 1.125rem;
    padding: 1.25rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.5);
    width: 100%;
    border: 1px solid rgba(var(--color-primary-rgb), 0.1);
    border-radius: 20px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03),
      inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--color-text);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .dark-theme .nav-link {
    background: rgba(30, 41, 59, 0.5);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2),
      0 2px 4px -1px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .nav-link::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      transparent,
      rgba(var(--color-primary-rgb), 0.1),
      transparent
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .nav-link:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--color-primary-rgb), 0.3);
    box-shadow: 0 12px 20px -5px rgba(var(--color-primary-rgb), 0.15),
      0 4px 6px -2px rgba(0, 0, 0, 0.05),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  .nav-link:hover::before {
    opacity: 1;
  }

  .nav-link-active {
    background: linear-gradient(
      135deg,
      rgba(var(--color-primary-rgb), 0.15),
      rgba(var(--color-primary-rgb), 0.05)
    );
    border-color: rgba(var(--color-primary-rgb), 0.5);
    color: var(--color-primary);
    font-weight: 600;
  }

  .dark-theme .nav-link-active {
    background: linear-gradient(
      135deg,
      rgba(var(--color-primary-rgb), 0.25),
      rgba(var(--color-primary-rgb), 0.15)
    );
  }

  .nav-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 360px;
    margin-top: auto;
    padding-top: 2rem;
    position: relative;
  }

  .nav-actions::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(var(--color-primary-rgb), 0.2),
      transparent
    );
  }

  .nav-right {
    gap: 0.5rem;
  }

  .nav-right > .desktop-search,
  .nav-right > .desktop-lang,
  .nav-right > .desktop-theme {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }
}

@media (max-width: 480px) {
  .nav {
    padding: 0 0.75rem;
  }

  .logo {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  .brand-name {
    font-size: 0.875rem;
  }

  .nav-menu-active {
    padding: 1rem;
  }

  .nav-links {
    padding: 0.5rem 0;
  }

  .nav-link {
    font-size: 0.875rem;
    padding: 0.625rem;
  }

  .search-btn {
    padding: 0.25rem 0.4rem;
  }

  .search-btn .kbd-shortcut {
    display: none;
  }

  .nav-actions {
    padding-top: 0.75rem;
    gap: 0.5rem;
  }
}

@media (max-width: 768px) {
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

.search-trigger {
  background: none;
  border: none;
  padding: 0.5rem;
  color: var(--color-secondary-text);
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--transition-normal) var(--bezier-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-trigger:hover {
  color: var(--color-text);
  background: var(--color-tertiary-background);
}

/* 搜索按钮样式 */
.search-btn {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-md);
  background-color: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-normal) var(--bezier-smooth);
}

.search-btn:hover {
  background-color: var(--color-glass-background);
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
}

.search-btn span {
  margin: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.search-btn .kbd-shortcut {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-tertiary-text);
}

.search-btn .kbd-shortcut kbd {
  background: var(--color-glass-background);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  padding: 0.1rem 0.3rem;
  font-size: 0.75rem;
  line-height: 1;
  margin: 0 0.15rem;
}

.nav-menu-active .nav-link {
  animation: slideInDown 0.5s var(--bezier-bounce) forwards;
  opacity: 0;
}

.nav-menu-active .nav-link:nth-child(1) {
  animation-delay: 0.1s;
}
.nav-menu-active .nav-link:nth-child(2) {
  animation-delay: 0.2s;
}
.nav-menu-active .nav-link:nth-child(3) {
  animation-delay: 0.3s;
}
.nav-menu-active .nav-link:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 菜单按钮动画优化 */
.menu-toggle {
  position: relative;
  z-index: 1000;
}

.menu-toggle span {
  width: 22px;
}

.menu-active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
  width: 28px;
}

.menu-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(10px);
}

.menu-active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
  width: 28px;
}

.nav-menu-active::-webkit-scrollbar {
  width: 4px;
}

.nav-menu-active::-webkit-scrollbar-track {
  background: transparent;
}

.nav-menu-active::-webkit-scrollbar-thumb {
  background: rgba(var(--color-primary-rgb), 0.2);
  border-radius: var(--radius-full);
}

.nav-menu-active::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--color-primary-rgb), 0.3);
}

/* 添加 CSS 样式 */
.no-scroll {
  overflow: hidden !important;
  padding-right: var(--scrollbar-width, 0px);
}
</style>

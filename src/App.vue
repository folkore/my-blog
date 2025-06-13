<script setup>
import { ref } from "vue";
import BackToTop from "./components/BackToTop.vue";
import ReadingProgress from "./components/ReadingProgress.vue";
import PageTransition from "./components/PageTransition.vue";
import HeaderMenu from "./components/HeaderMenu.vue";
import GlobalSearch from "./components/GlobalSearch.vue";
import AppFooter from "./components/AppFooter.vue";
import { usePostsStore } from "./store/index.js";
import Live2DPet from "./components/Live2DPet.vue";

const postsStore = usePostsStore();

const globalSearch = ref(null);

const openSearch = () => {
  globalSearch.value?.openSearch();
};
</script>

<template>
  <div class="app">
    <ReadingProgress />
    <HeaderMenu @open-search="openSearch" />

    <main class="main">
      <router-view v-slot="{ Component, route }">
        <PageTransition :name="route.meta.transition || 'page'">
          <component :is="Component" :key="route.path" />
        </PageTransition>
      </router-view>
    </main>

    <AppFooter />

    <BackToTop />
    <Live2DPet />
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

  /* RGB值用于透明度计算 */
  --color-primary-rgb: 0, 102, 255;
  --color-accent-rgb: 0, 212, 255;
  --color-success-rgb: 16, 185, 129;

  /* 布局尺寸 */
  --header-height: 72px;
  --header-height-mobile: 64px;
  --content-width: 1200px;
  --nav-link-size: 0.875rem;

  /* 动画时间 */
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

  /* 模糊效果 */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 12px;

  /* Z-index层级 */
  --z-header: 100;
  --z-dropdown: 200;
  --z-modal: 300;
  --z-tooltip: 400;
  --z-progress: 500;
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
  --nav-height: 4rem;
  --nav-background: rgba(255, 255, 255, 0.8);
  --nav-background-dark: rgba(18, 18, 18, 0.8);
  --blur-strength: 12px;
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
    font-size: 1.125rem;
  }

  .nav-menu {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--nav-height));
    background: var(--nav-background);
    backdrop-filter: blur(var(--blur-strength));
    -webkit-backdrop-filter: blur(var(--blur-strength));
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow-y: auto;
  }

  .dark-theme .nav-menu {
    background: var(--nav-background-dark);
  }

  .nav-menu-active {
    transform: translateX(0);
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .nav-link {
    font-size: 1.25rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .nav-link-active {
    background: var(--color-primary-gradient);
    border-color: transparent;
    color: white;
  }

  .nav-actions {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mobile-theme {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .nav-right > .desktop-lang,
  .nav-right > .desktop-theme {
    display: none;
  }

  .nav-actions .language-switcher {
    display: flex;
    gap: 0.5rem;
  }

  .nav-actions .lang-btn,
  .mobile-theme {
    flex: 1;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    color: var(--color-text);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .nav-actions .lang-btn:hover,
  .mobile-theme:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08);
  }

  .nav-actions .lang-btn.active {
    background: var(--color-primary-gradient);
    border-color: transparent;
    color: white;
  }

  .menu-toggle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    padding: 8px;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .menu-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s ease;
  }

  .menu-active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .menu-active span:nth-child(2) {
    opacity: 0;
  }

  .menu-active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}

@media (max-width: 480px) {
  .nav {
    padding: 0 0.75rem;
  }

  .logo {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .brand-name {
    font-size: 1rem;
  }

  .nav-menu-active {
    padding: 1.5rem 1rem;
  }

  .nav-link {
    font-size: 0.9375rem;
    padding: 0.875rem;
  }

  .nav-actions {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
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

  :root {
    --header-height: var(--header-height-mobile);
    --content-width: 100%;
    --nav-link-size: 0.8125rem;
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

/* 添加过渡动画 */
.nav-menu {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-menu-enter-active,
.nav-menu-leave-active {
  transition: transform 0.3s ease;
}

.nav-menu-enter-from,
.nav-menu-leave-to {
  transform: translateX(100%);
}

/* 添加背景遮罩动画 */
.nav-menu-active::before {
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 桌面端样式 */
@media (min-width: 1025px) {
  .nav-menu {
    position: static;
    height: auto;
    padding: 0;
    transform: none;
    background: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-theme {
    display: none;
  }
}

/* 隐藏桌面端组件 */
@media (max-width: 1024px) {
  .desktop-theme,
  .desktop-lang {
    display: none;
  }
}

/* 头部导航样式 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  z-index: 100;
  transition: all 0.3s ease;
  background: var(--nav-background);
  backdrop-filter: blur(var(--blur-strength));
  -webkit-backdrop-filter: blur(var(--blur-strength));
}

.dark-theme .header {
  background: var(--nav-background-dark);
}

.header-scrolled {
  background: var(--color-glass-background);
  box-shadow: var(--shadow-md);
}

.nav {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  max-width: var(--container-max-width);
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text);
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  transition: transform 0.35s var(--bezier-bounce), box-shadow 0.35s;
}

.logo:hover {
  transform: scale(1.12) rotate(3deg);
  box-shadow: var(--shadow-glow);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

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
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  margin: -0.5rem;
  position: relative;
  z-index: 101;
}

@media (max-width: 1024px) {
  .menu-toggle {
    display: block;
  }
}

.menu-icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 2px;
  position: absolute;
  transition: all 0.3s ease;
}

.line-top {
  top: 4px;
}

.line-middle {
  top: 11px;
}

.line-bottom {
  top: 18px;
}

.open .line-top {
  transform: translateY(7px) rotate(45deg);
}

.open .line-middle {
  opacity: 0;
}

.open .line-bottom {
  transform: translateY(-7px) rotate(-45deg);
}

/* desktop nav link aesthetics */
.nav-link {
  position: relative;
  font-weight: 500;
  color: var(--color-text);
  transition: color 0.3s ease;
}
.nav-link::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition: width 0.3s ease;
}

/* hover underline */
.nav-link:hover {
  color: var(--color-primary);
}
.nav-link:hover::after {
  width: 100%;
}

/* active page indicator */
.nav-link-active {
  color: var(--color-primary);
}
.nav-link-active::after {
  width: 100%;
}
</style>

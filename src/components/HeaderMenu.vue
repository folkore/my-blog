<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useTheme } from "../composables/useTheme";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useScrollLock } from "../composables/useScrollLock";

// 向父组件发送事件
const emit = defineEmits(["open-search"]);

// 状态管理
const isScrolled = ref(false);
const isMenuOpen = ref(false);

// 主题管理
const { currentTheme, toggleTheme, cleanup: cleanupTheme, THEME } = useTheme();

// 多语言
const { t, locale } = useI18n();
const route = useRoute();

// 导航项
const navItems = ref([]);
const updateNavItems = () => {
  navItems.value = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.bookmarks"), path: "/bookmarks" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];
};

// 滚动锁定
const { lock, unlock } = useScrollLock();

// 监听器和生命周期
watch(locale, updateNavItems, { immediate: true });

watch(isMenuOpen, (newValue) => {
  newValue ? lock() : unlock();
});

watch(
  () => route.fullPath,
  () => {
    if (isMenuOpen.value) {
      isMenuOpen.value = false;
      unlock();
    }
  }
);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  unlock();
  cleanupTheme();
});
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <nav class="header__nav container">
      <!-- Logo区域 -->
      <div class="header__brand">
        <router-link to="/" class="header__logo" @click="isMenuOpen = false">
          <div class="header__logo-integrated">
            <span class="header__logo-text">Memoir</span>
            <span class="header__logo-separator"></span>
            <span class="header__logo-tagline">Stories in Time</span>
          </div>
        </router-link>
      </div>

      <!-- 移动端搜索框（点击后打开全局搜索） -->
      <div
        class="header__mobile-search"
        @click="emit('open-search')"
        :aria-label="t('search.button')"
      >
        <svg
          class="header__mobile-search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span class="header__mobile-search-placeholder">
          {{ t("search.placeholder") }}
        </span>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        class="header__menu-toggle"
        @click="isMenuOpen = !isMenuOpen"
        :aria-label="t('nav.menu')"
        :aria-expanded="isMenuOpen"
      >
        <div
          class="header__menu-icon"
          :class="{ 'header__menu-icon--open': isMenuOpen }"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <!-- 导航菜单 -->
      <div
        class="header__menu"
        :class="{ 'header__menu--active': isMenuOpen }"
        role="navigation"
      >
        <!-- 导航链接 -->
        <div class="header__nav-links">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="header__nav-link"
            :class="{ 'header__nav-link--active': route.path === item.path }"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- 移动端操作区 -->
        <div class="header__actions header__actions--mobile">
          <LanguageSwitcher />
          <button
            class="header__theme-toggle"
            @click="toggleTheme"
            :title="t('theme.toggle')"
          >
            <span
              class="header__theme-icon"
              :class="{
                'header__theme-icon--dark': currentTheme === THEME.DARK,
              }"
            >
              <template v-if="currentTheme === THEME.DARK">
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
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </template>
              <template v-else>
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
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </template>
            </span>
          </button>
        </div>
      </div>

      <!-- 桌面端操作区 -->
      <div class="header__actions header__actions--desktop">
        <button
          class="header__search-btn"
          @click="emit('open-search')"
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>{{ t("search.button") }}</span>
          <span class="header__kbd-shortcut">
            <kbd>Ctrl</kbd><span>+</span><kbd>K</kbd>
          </span>
        </button>
        <LanguageSwitcher />
        <button
          class="header__theme-toggle"
          @click="toggleTheme"
          :title="t('theme.toggle')"
        >
          <span
            class="header__theme-icon"
            :class="{ 'header__theme-icon--dark': currentTheme === THEME.DARK }"
          >
            <template v-if="currentTheme === THEME.DARK">
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
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </template>
            <template v-else>
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
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </template>
          </span>
        </button>
      </div>
    </nav>
  </header>
</template>

<style>
/* 基础变量 */
:root {
  --header-height: 64px;
  --header-background: rgba(255, 255, 255, 0.8);
  --header-background-dark: rgba(15, 23, 42, 0.9);
  --header-border: rgba(0, 0, 0, 0.1);
  --header-border-dark: rgba(255, 255, 255, 0.1);
  --menu-background: rgba(255, 255, 255, 0.95);
  --menu-background-dark: rgba(15, 23, 42, 0.95);
  --color-hover-background: rgba(0, 0, 0, 0.05);
  --color-hover-background-dark: rgba(255, 255, 255, 0.1);
  --transition-timing: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 头部基础样式 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--header-background);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--header-border);
  transition:
    background var(--transition-timing),
    border-color var(--transition-timing);
  z-index: 1000;
}

.header--scrolled {
  border-bottom-color: var(--header-border);
}

.header__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
}

/* Logo样式 */
.header__brand {
  display: flex;
  align-items: center;
}

.header__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: 8px 16px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    transparent 50%,
    var(--color-hover-background) 50%
  );
  background-size: 200% 100%;
  background-position: 0 0;
  transition: all 0.4s ease;
}

.header__logo:hover {
  background-position: -100% 0;
}

.header__logo-integrated {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__logo-text {
  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-weight: 600;
  font-size: 1.75rem;
  letter-spacing: 0.5px;
  color: var(--color-text);
  transition: all 0.4s ease;
  position: relative;
}

.header__logo-text::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease;
}

.header__logo:hover .header__logo-text::after {
  transform: scaleX(1);
  transform-origin: left;
}

.header__logo-separator {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 12px;
  transition: background-color 0.4s ease;
}

.header__logo-tagline {
  font-family: "Poppins", sans-serif;
  font-weight: 300;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--color-secondary-text);
  transition: all 0.4s ease;
}

.header__logo:hover .header__logo-text {
  color: var(--color-primary);
}

.header__logo:hover .header__logo-separator {
  background: var(--color-primary);
}

.header__logo:hover .header__logo-tagline {
  color: var(--color-primary);
  letter-spacing: 2px;
}

/* 深色模式适配 */
.dark-theme .header__logo {
  background: linear-gradient(
    to right,
    transparent 50%,
    var(--color-hover-background-dark) 50%
  );
  background-size: 200% 100%;
  background-position: 0 0;
}

.dark-theme .header__logo-text {
  color: var(--color-text);
}

.dark-theme .header__logo-separator {
  background: var(--color-border-dark);
}

.dark-theme .header__logo-tagline {
  color: var(--color-secondary-text);
}

.dark-theme .header__logo:hover .header__logo-text,
.dark-theme .header__logo:hover .header__logo-tagline {
  color: var(--color-primary);
}

.dark-theme .header__logo:hover .header__logo-separator {
  background: var(--color-primary);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header__logo {
    padding: 6px 12px;
  }

  .header__logo-text {
    font-size: 1.5rem;
  }

  .header__logo-separator,
  .header__logo-tagline {
    display: none;
  }
}

/* 菜单按钮样式 */
.header__menu-toggle {
  display: none;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.header__menu-icon {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header__menu-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background: currentColor;
  transition:
    transform var(--transition-timing),
    opacity var(--transition-timing);
}

.header__menu-icon--open span:first-child {
  transform: translateY(9px) rotate(45deg);
}

.header__menu-icon--open span:nth-child(2) {
  opacity: 0;
}

.header__menu-icon--open span:last-child {
  transform: translateY(-9px) rotate(-45deg);
}

/* 导航链接样式 */
.header__nav-link {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 8px;
  transition: all var(--transition-timing);
  font-weight: 500;
  position: relative;
}

.header__nav-link:hover {
  background: var(--color-hover-background);
}

.header__nav-link--active {
  color: var(--color-primary);
  font-weight: 600;
}

.header__nav-link--active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transform-origin: right;
  animation: linkIndicator 0.3s ease-out forwards;
}

@keyframes linkIndicator {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* 操作区样式 */
.header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__search-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-secondary-background);
  border: none;
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;
  transition: background var(--transition-timing);
}

.header__search-btn:hover {
  background: var(--color-hover-background);
}

.header__kbd-shortcut {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

.header__kbd-shortcut kbd {
  padding: 0.125rem 0.375rem;
  background: var(--color-tertiary-background);
  border-radius: 4px;
  font-family: monospace;
}

.header__theme-toggle {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  border-radius: 8px;
  transition: background var(--transition-timing);
}

.header__theme-toggle:hover {
  background: var(--color-hover-background);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .header__nav {
    justify-content: flex-start;
  }

  .header__menu-toggle {
    display: block;
    margin-left: auto;
  }

  .header__menu {
    position: fixed;
    top: var(--header-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--header-height));
    background: var(--menu-background);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 2rem;
    transform: translateX(-100%);
    transition: transform var(--transition-timing);
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow-y: auto;
    z-index: 999;
  }

  .header__menu--active {
    transform: translateX(0);
  }

  .header__nav-links {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .header__nav-link {
    padding: 0.75rem 1rem;
    border-radius: 12px;
  }

  .header__nav-link--active {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
  }

  .header__nav-link--active::after {
    display: none;
  }

  .header__actions--desktop {
    display: none;
  }

  .header__actions--mobile {
    margin-top: auto;
    padding-top: 2rem;
    border-top: 1px solid var(--header-border);
  }

  .header__mobile-search {
    display: flex;
  }

  /* 深色模式下的移动端菜单样式 */
  .dark-theme .header__menu {
    background: var(--menu-background-dark);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .dark-theme .header__actions--mobile {
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .dark-theme .header__nav-link {
    color: var(--color-text);
  }

  .dark-theme .header__nav-link:hover {
    background: var(--color-hover-background-dark);
  }

  .dark-theme .header__nav-link--active {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.4);
  }

  /* 深色模式下的移动端搜索框 */
  .dark-theme .header__mobile-search {
    background: var(--color-secondary-background);
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--color-text);
  }

  .dark-theme .header__mobile-search-placeholder {
    color: var(--color-secondary-text);
  }

  .dark-theme .header__mobile-search-icon {
    color: var(--color-secondary-text);
  }
}

@media (min-width: 769px) {
  .header__menu {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .header__nav-links {
    display: flex;
    gap: 1rem;
  }

  .header__actions--mobile {
    display: none;
  }

  .header__mobile-search {
    display: none;
  }
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.header__menu--active {
  animation: fadeIn 0.3s ease-out;
}

/* 移动端搜索框 */
.header__mobile-search {
  display: none;
  flex: 1;
  max-width: 100%;
  margin: 0 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-secondary-background);
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: text;
}

.header__mobile-search-placeholder {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-secondary-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__mobile-search-icon {
  color: var(--color-secondary-text);
}

@media (max-width: 768px) {
  .header__mobile-search {
    display: flex;
  }
}

@media (min-width: 769px) {
  .header__mobile-search {
    display: none;
  }
}

.header__logo:hover .header__logo-text {
  color: var(--color-primary);
}

.header__logo:hover .header__logo-tagline {
  color: var(--color-primary);
}
</style>

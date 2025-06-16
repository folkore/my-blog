<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useTheme } from "../composables/useTheme";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

// 向父组件发送事件
const emit = defineEmits(["open-search"]);

const isScrolled = ref(false);
const isMenuOpen = ref(false);

// 主题切换
const { currentTheme, toggleTheme, cleanup, THEME } = useTheme();

// 多语言与导航
const { t, locale } = useI18n();
const navItems = ref([]);
9;

const updateNavItems = () => {
  navItems.value = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.blog"), path: "/blog" },
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.contact"), path: "/contact" },
  ];
};

watch(locale, updateNavItems, { immediate: true });

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

// 监听路由变化，路由切换时自动关闭菜单并恢复滚动条
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    if (isMenuOpen.value) {
      isMenuOpen.value = false;
    }
  }
);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  cleanup();
});
</script>

<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <nav class="nav container">
      <div class="nav-brand">
        <router-link to="/" class="nav-brand" @click="isMenuOpen = false">
          <div class="logo">M</div>
          <span class="brand-name">{{ t("brand.name") }}</span>
        </router-link>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        class="menu-toggle"
        @click="toggleMenu"
        :aria-label="t('nav.menu')"
      >
        <div class="menu-icon-wrapper" :class="{ open: isMenuOpen }">
          <span class="hamburger-line line-top"></span>
          <span class="hamburger-line line-middle"></span>
          <span class="hamburger-line line-bottom"></span>
        </div>
      </button>

      <!-- 移动端抽屉菜单 -->
      <Transition name="nav-menu">
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
          <div class="nav-actions">
            <LanguageSwitcher />
            <button
              class="theme-toggle mobile-theme"
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
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
              </span>
            </button>
          </div>
        </div>
      </Transition>

      <!-- 桌面端右侧 -->
      <div class="nav-right">
        <button
          class="search-btn"
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
          <span class="kbd-shortcut"
            ><kbd>Ctrl</kbd><span>+</span><kbd>K</kbd></span
          >
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
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
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
          </span>
        </button>
      </div>
    </nav>
  </header>
</template>

<style></style>

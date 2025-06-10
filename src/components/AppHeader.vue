<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

// 定义props
const props = defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
});

// 定义事件
const emit = defineEmits(["toggle-dark-mode"]);

// 控制菜单展开
const isMenuOpen = ref(false);
const router = useRouter();

// 响应式处理滚动
const scrollPosition = ref(0);
const isScrolled = ref(false);

// 监听滚动事件
const handleScroll = () => {
  scrollPosition.value = window.scrollY;
  isScrolled.value = scrollPosition.value > 50;
};

// 切换主题
const toggleTheme = () => {
  emit("toggle-dark-mode");
};

// 关闭菜单并导航到指定路径
const navigateTo = (path) => {
  isMenuOpen.value = false;
  router.push(path);
};

// 挂载和卸载事件监听器
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 立即计算初始状态
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="header"
    :class="{
      scrolled: isScrolled,
      'dark-header': props.isDark,
    }"
  >
    <div class="container header-container">
      <div class="logo" @click="navigateTo('/')">
        <h1>MyBlog</h1>
      </div>

      <!-- 桌面导航菜单 -->
      <nav class="desktop-nav">
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/blog">博客</router-link></li>
          <li><router-link to="/about">关于</router-link></li>
          <li><router-link to="/contact">联系我</router-link></li>
        </ul>
      </nav>

      <!-- 右侧操作区 -->
      <div class="actions">
        <!-- 暗黑模式切换按钮 -->
        <button
          class="theme-toggle"
          @click="toggleTheme"
          aria-label="Toggle dark mode"
        >
          <span v-if="props.isDark" class="toggle-icon">🌞</span>
          <span v-else class="toggle-icon">🌙</span>
        </button>

        <!-- 移动端菜单按钮 -->
        <button
          class="menu-toggle"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="Toggle menu"
          :aria-expanded="isMenuOpen"
        >
          <div class="hamburger" :class="{ 'is-active': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div class="mobile-nav" :class="{ 'is-open': isMenuOpen }">
      <ul>
        <li @click="navigateTo('/')">首页</li>
        <li @click="navigateTo('/blog')">博客</li>
        <li @click="navigateTo('/about')">关于</li>
        <li @click="navigateTo('/contact')">联系我</li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--color-header-background);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 100;
  transition: all var(--transition-duration);
  border-bottom: 1px solid transparent;
}

.header.scrolled {
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 2px 10px var(--color-shadow);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  cursor: pointer;
}

.logo h1 {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text);
}

/* 桌面导航菜单 */
.desktop-nav {
  display: flex;
}

.desktop-nav ul {
  display: flex;
  list-style: none;
}

.desktop-nav li {
  margin: 0 12px;
}

.desktop-nav a {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  transition: color var(--transition-duration);
  padding: 8px 0;
  position: relative;
}

.desktop-nav a:hover {
  color: var(--color-link);
}

.desktop-nav a.router-link-active {
  color: var(--color-link);
}

.desktop-nav a.router-link-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-link);
  border-radius: 2px;
}

/* 右侧操作区 */
.actions {
  display: flex;
  align-items: center;
}

.theme-toggle {
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  color: var(--color-text);
  transition: background-color var(--transition-duration);
}

.theme-toggle:hover {
  background-color: var(--color-secondary-background);
}

.toggle-icon {
  font-size: 20px;
}

/* 汉堡菜单按钮 */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 2px;
  width: 100%;
  background-color: var(--color-text);
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 9px;
}

.hamburger span:nth-child(3) {
  top: 18px;
}

.hamburger.is-active span:nth-child(1) {
  top: 9px;
  transform: rotate(135deg);
}

.hamburger.is-active span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.is-active span:nth-child(3) {
  top: 9px;
  transform: rotate(-135deg);
}

/* 移动端菜单 */
.mobile-nav {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  height: 0;
  overflow: hidden;
  transition: height var(--transition-duration);
  box-shadow: 0 4px 8px var(--color-shadow);
}

.mobile-nav.is-open {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.mobile-nav ul {
  list-style: none;
  padding: 20px;
}

.mobile-nav li {
  font-size: 24px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
}

.mobile-nav li:last-child {
  border-bottom: none;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .menu-toggle {
    display: block;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  headings: { id: string; level: number; text: string }[];
}>();

/* ============== 目录高亮 ============== */
const activeHeading = ref("");
function updateActiveHeading() {
  const headings = document.querySelectorAll<HTMLElement>("h2, h3");
  const scrollY = window.scrollY;

  for (const h of headings) {
    if (scrollY >= h.offsetTop - 110) activeHeading.value = h.id;
  }
}

/* ============== 响应式断点 ============== */
const isDesktop = ref(window.innerWidth >= 768);
const isDrawerOpen = ref(false);

function handleResize() {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) isDrawerOpen.value = false; // 进入桌面端时自动关闭抽屉
}

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

/* 生命周期 */
onMounted(() => {
  window.addEventListener("scroll", updateActiveHeading, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  updateActiveHeading();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveHeading);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <!-- ================= 桌面端 ================= -->
  <nav v-if="isDesktop" class="toc toc-desktop" aria-label="文章目录">
    <div class="toc-header">目录</div>
    <ul>
      <li v-for="h in props.headings" :key="h.id" :class="['level-' + h.level]">
        <a
          :href="`#${h.id}`"
          :class="['toc-link', { active: activeHeading === h.id }]"
        >
          {{ h.text }}
        </a>
      </li>
    </ul>
  </nav>

  <!-- ================= 移动端按钮 ================= -->
  <button
    v-else
    class="toc-toggle-btn"
    :aria-expanded="isDrawerOpen"
    @click="toggleDrawer"
  >
    <span class="icon">☰</span> 目录
  </button>

  <!-- ================= 抽屉 ================= -->
  <Teleport to="body">
    <transition name="toc-drawer">
      <aside
        v-show="isDrawerOpen"
        class="toc toc-mobile"
        aria-label="移动端目录抽屉"
      >
        <div class="toc-mobile-header">
          <span>目录</span>
          <button class="close-btn" @click="toggleDrawer">✕</button>
        </div>
        <ul>
          <li
            v-for="h in props.headings"
            :key="h.id"
            :class="['level-' + h.level]"
          >
            <a
              :href="`#${h.id}`"
              :class="['toc-link', { active: activeHeading === h.id }]"
              @click="toggleDrawer"
            >
              {{ h.text }}
            </a>
          </li>
        </ul>
      </aside>
    </transition>
  </Teleport>
</template>

<style lang="scss" scoped>
/* ====== 变量 ====== */
$toc-radius: 12px;
$toc-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
$toc-bg-light: rgba(255, 255, 255, 0.8);
$toc-bg-dark: rgba(30, 30, 30, 0.88);
$toc-border-light: rgba(255, 255, 255, 0.4);
$toc-border-dark: rgba(255, 255, 255, 0.08);

/* ====== 通用样式 ====== */
.toc {
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border-radius: $toc-radius;
  box-shadow: $toc-shadow;
  padding: 1.4rem 1.1rem;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  background: $toc-bg-light;
  border: 1px solid $toc-border-light;

  .toc-header,
  .toc-mobile-header {
    font-weight: 600;
    font-size: 1.05rem;
    margin-bottom: 1rem;
    position: relative;
    padding-bottom: 0.6rem;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 44px;
      height: 3px;
      border-radius: 2px;
      background: var(--color-primary);
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .toc-link {
    display: block;
    padding: 0.45rem 0;
    padding-left: 1rem;
    font-size: 0.9rem;
    border-left: 3px solid transparent;
    color: var(--color-text);
    opacity: 0.85;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.25s;

    &.active {
      color: var(--color-primary);
      opacity: 1;
      border-left-color: var(--color-primary);
      background: rgba(var(--color-primary-rgb, 51, 105, 255), 0.08);
    }
    &:hover {
      color: var(--color-primary);
    }
  }

  /* 缩进 */
  .level-2 {
    margin-left: 0;
  }
  .level-3 {
    margin-left: 1rem;
    font-size: 0.85rem;
  }
}

/* ====== 桌面端专属 ====== */
.toc-desktop {
  /* position: sticky; */ /* 由父组件 BlogPost.vue 控制定位 */
  /* top: 80px; */
  max-height: calc(100vh - 120px);
  overflow-y: auto;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--color-primary-light, #409eff);
    border-radius: 2px;
  }
}

/* ====== 移动端按钮 ====== */
.toc-toggle-btn {
  position: fixed;
  right: 1rem;
  bottom: 1.2rem;
  z-index: 700;
  padding: 0.6rem 0.9rem;
  border-radius: 50px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.92rem;
  border: none;
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb, 51, 105, 255), 0.5);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: transform 0.25s;
  .icon {
    font-size: 1.15rem;
    line-height: 1;
  }
  &:active {
    transform: scale(0.96);
  }
}

/* ====== 抽屉主体 ====== */
.toc-mobile {
  position: fixed;
  top: 0;
  right: 0;
  width: 82%;
  max-width: 320px;
  height: 100%;
  padding-top: 1rem;
  z-index: 999;
  overflow-y: auto;
  transform: translateX(100%);
  /* 背景色、边框在 .toc 通用已有 */

  .toc-mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.2rem 0.8rem 0;
    .close-btn {
      font-size: 1.2rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text);
    }
  }
}

/* ====== 抽屉动画 ====== */
.toc-drawer-enter-active,
.toc-drawer-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.toc-drawer-enter-from,
.toc-drawer-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.toc-drawer-enter-to,
.toc-drawer-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* ====== 暗黑主题覆盖 ====== */
.dark-theme {
  .toc {
    background: $toc-bg-dark;
    border-color: $toc-border-dark;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);

    .toc-link {
      color: var(--color-secondary-text);
      &.active {
        background: rgba(var(--color-primary-rgb, 65, 125, 255), 0.25);
        color: var(--color-primary-light, #409eff);
      }
      &:hover {
        color: var(--color-primary-light, #409eff);
      }
    }
  }

  .toc-toggle-btn {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.55);
  }
}
</style>

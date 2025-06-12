<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  headings: {
    type: Array,
    required: true,
  },
});

const activeHeading = ref("");

const updateActiveHeading = () => {
  const headings = document.querySelectorAll("h2, h3");
  const scrollPosition = window.scrollY;

  for (const heading of headings) {
    const top = heading.offsetTop - 100;
    if (scrollPosition >= top) {
      activeHeading.value = heading.id;
    }
  }
};

onMounted(() => {
  window.addEventListener("scroll", updateActiveHeading);
  updateActiveHeading();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveHeading);
});
</script>

<template>
  <nav class="table-of-contents" aria-label="文章目录">
    <div class="toc-header">目录</div>
    <ul>
      <li v-for="heading in headings" :key="heading.id">
        <a
          :href="`#${heading.id}`"
          :class="{
            'toc-link': true,
            'is-active': activeHeading === heading.id,
            [`level-${heading.level}`]: true,
          }"
          @click="() => {}"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/************ 目录容器 ************/
.table-of-contents {
  /* 玻璃拟态背景（浅色） */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(255, 255, 255, 0.65) 100%
  );
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 1.5rem 1.25rem;
  width: 100%;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.table-of-contents:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/************ 桌面端滚动容器 ************/
@media (min-width: 992px) {
  .table-of-contents {
    position: sticky;
    top: 80px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--color-primary) transparent;
  }

  .table-of-contents::-webkit-scrollbar {
    width: 5px;
  }

  .table-of-contents::-webkit-scrollbar-thumb {
    background: var(--color-primary-light, #409eff);
    border-radius: 2px;
  }
}

/************ 标题 ************/
.toc-header {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
  position: relative;
  padding-bottom: 0.6rem;
}

.toc-header::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background: var(--color-primary);
}

/************ 列表 ************/
.table-of-contents ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.toc-link {
  display: block;
  padding: 0.45rem 0;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.85;
  transition: all 0.25s ease;
  border-left: 3px solid transparent;
  padding-left: 1rem;
  line-height: 1.45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-link:hover {
  color: var(--color-primary);
}

.toc-link.is-active {
  color: var(--color-primary);
  opacity: 1;
  border-left-color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 51, 105, 255), 0.08);
}

.toc-link.level-2:not(.is-active)::after {
  display: none;
}

/************ 层级缩进 ************/
.level-2 {
  margin-left: 0;
}

.level-3 {
  margin-left: 1rem;
  font-size: 0.85rem;
}

/************ 移动端 ************/
@media (max-width: 991px) {
  .table-of-contents {
    margin-bottom: 2rem;
  }
}

/* 移除 prefers-color-scheme 覆盖，改用根类 */
.dark-theme .table-of-contents {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.88) 0%,
    rgba(30, 30, 30, 0.7) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
}
.dark-theme .toc-header {
  color: var(--color-text);
}
.dark-theme .toc-link {
  color: var(--color-secondary-text);
}
.dark-theme .toc-link:hover {
  color: var(--color-primary-light, #409eff);
}
.dark-theme .toc-link.is-active {
  background: rgba(var(--color-primary-rgb, 65, 125, 255), 0.25);
  color: var(--color-primary-light, #409eff);
}
.dark-theme .table-of-contents::-webkit-scrollbar-thumb {
  background: var(--color-primary-light, #409eff);
}

/* --- 分段线（一级条目之间）--- */
li + li .toc-link.level-2::before {
  content: "";
  position: absolute;
  top: -0.75rem;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-border);
  opacity: 0.9;
}

.dark-theme li + li .toc-link.level-2::before {
  background: rgba(255, 255, 255, 0.12);
}

/* 取消旧 dashed */
.toc-link.level-2:not(.is-active)::after {
  display: none;
}
</style>

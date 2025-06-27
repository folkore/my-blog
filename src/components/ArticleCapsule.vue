<script setup>
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const { t } = useI18n();
const capsuleRef = ref(null);
const isVisible = ref(false);

// 检测深色模式
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains("dark-theme");
});

// 根据发布时间计算胶囊颜色（优化为更柔和的色彩）
const capsuleColor = computed(() => {
  const postDate = new Date(props.post.date);
  const now = new Date();
  const daysDiff = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));

  // 根据时间距离映射颜色，使用更柔和的色调
  if (daysDiff < 30) {
    return {
      hue: 210,
      saturation: isDarkMode.value ? 45 : 35,
      lightness: isDarkMode.value ? 55 : 65,
    }; // 柔和蓝色 - 最新
  } else if (daysDiff < 90) {
    return {
      hue: 220,
      saturation: isDarkMode.value ? 40 : 30,
      lightness: isDarkMode.value ? 50 : 60,
    }; // 蓝紫色 - 较新
  } else if (daysDiff < 180) {
    return {
      hue: 230,
      saturation: isDarkMode.value ? 35 : 25,
      lightness: isDarkMode.value ? 45 : 55,
    }; // 深蓝紫 - 中等
  } else {
    return {
      hue: 240,
      saturation: isDarkMode.value ? 30 : 20,
      lightness: isDarkMode.value ? 40 : 50,
    }; // 深紫 - 较旧
  }
});

// 计算胶囊位置（错落排列）
const capsulePosition = computed(() => {
  const isEven = props.index % 2 === 0;
  const offset = (props.index % 4) * 10; // 0, 10, 20, 30

  return {
    alignSelf: isEven ? "flex-start" : "flex-end",
    marginLeft: isEven ? `${offset}px` : "auto",
    marginRight: isEven ? "auto" : `${offset}px`,
    transform: `translateX(${isEven ? offset : -offset}px)`,
  };
});

// 格式化日期
const formattedDate = computed(() => {
  return new Date(props.post.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// 计算阅读时间
const readTime = computed(() => {
  if (!props.post.content) return "1 分钟阅读";
  const words = props.post.content.length / 2; // 中文按字符数/2估算
  const minutes = Math.ceil(words / 200);
  return `${minutes} 分钟阅读`;
});

// 设置可见性观察器
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  if (capsuleRef.value) {
    observer.observe(capsuleRef.value);
  }
});
</script>

<template>
  <article
    ref="capsuleRef"
    class="article-capsule"
    :class="{ 'is-visible': isVisible }"
    :style="{
      ...capsulePosition,
      '--capsule-hue': capsuleColor.hue,
      '--capsule-saturation': capsuleColor.saturation + '%',
      '--capsule-lightness': capsuleColor.lightness + '%',
      '--animation-delay': index * 0.1 + 's',
    }"
  >
    <!-- 胶囊发光边框 -->
    <div class="capsule-glow"></div>

    <!-- 胶囊内容 -->
    <div class="capsule-content">
      <!-- 文章封面 -->
      <div class="capsule-cover">
        <img v-lazy="post.cover" :alt="post.title" class="cover-image" />
        <div class="cover-overlay"></div>
      </div>

      <!-- 文章信息 -->
      <div class="capsule-info">
        <!-- 标签 -->
        <div class="capsule-tags">
          <span
            v-for="(tag, tagIndex) in post.tags.slice(0, 3)"
            :key="tagIndex"
            class="capsule-tag"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 标题 -->
        <h2
          class="capsule-title"
          v-html="post.highlightedTitle || post.title"
        ></h2>

        <!-- 摘要 -->
        <p class="capsule-excerpt" v-html="post.preview || post.excerpt"></p>

        <!-- 元信息 -->
        <div class="capsule-meta">
          <div class="meta-left">
            <time class="capsule-date">{{ formattedDate }}</time>
            <span class="capsule-read-time">{{ readTime }}</span>
          </div>

          <router-link :to="`/blog/${post.slug}`" class="capsule-link">
            <span>{{ t("blog.readMore", "阅读更多") }}</span>
            <svg
              class="link-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 时间标记 -->
    <div class="time-marker">
      <div class="marker-dot"></div>
      <div class="marker-line"></div>
    </div>
  </article>
</template>

<style scoped>
.article-capsule {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0; /* 移除外边距，由父容器的gap控制间距 */
  opacity: 0;
  transform: translateY(50px) scale(0.9);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: var(--animation-delay);
}

.article-capsule.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 胶囊发光效果 - 简化版 */
.capsule-glow {
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  background: linear-gradient(
    135deg,
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      var(--capsule-lightness),
      0.3
    ),
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      calc(var(--capsule-lightness) + 10%),
      0.15
    )
  );
  filter: blur(8px);
  opacity: 0.4;
  animation: glowPulse 6s ease-in-out infinite;
}

/* 胶囊主体 - 简化的卡片效果，支持深浅主题 */
.capsule-content {
  position: relative;
  background: var(--capsule-bg);
  backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid var(--capsule-border);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--capsule-shadow);
}

/* 深浅主题变量 */
.dark-theme .capsule-content {
  --capsule-bg: linear-gradient(
    145deg,
    rgba(30, 41, 59, 0.85) 0%,
    rgba(15, 23, 42, 0.9) 50%,
    rgba(30, 41, 59, 0.8) 100%
  );
  --capsule-border: rgba(51, 65, 85, 0.6);
  --capsule-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(148, 163, 184, 0.1);
}

:root .capsule-content {
  --capsule-bg: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.9) 50%,
    rgba(255, 255, 255, 0.92) 100%
  );
  --capsule-border: rgba(226, 232, 240, 0.8);
  --capsule-shadow:
    0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.article-capsule:hover .capsule-content {
  transform: translateY(-6px) scale(1.01);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 0 30px
      hsla(
        var(--capsule-hue),
        var(--capsule-saturation),
        var(--capsule-lightness),
        0.2
      ),
    inset 0 1px 0 var(--capsule-border);
}

/* 封面图片 */
.capsule-cover {
  position: relative;
  height: 120px; /* 减少高度从200px到120px */
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-capsule:hover .cover-image {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

/* 胶囊信息区域 */
.capsule-info {
  padding: 1rem; /* 减少内边距从1.5rem到1rem */
}

.capsule-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem; /* 减少下边距从1rem到0.75rem */
}

.capsule-tag {
  padding: 0.35rem 0.8rem;
  background: var(--tag-bg);
  color: var(--tag-color);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid var(--tag-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

/* 深浅主题标签样式 */
.dark-theme .capsule-tag {
  --tag-bg: rgba(51, 65, 85, 0.6);
  --tag-color: rgba(203, 213, 225, 0.9);
  --tag-border: rgba(71, 85, 105, 0.5);
}

/* 浅色主题标签样式 - 修复颜色问题 */
.capsule-tag {
  --tag-bg: rgba(241, 245, 249, 0.8);
  --tag-color: rgba(71, 85, 105, 0.9);
  --tag-border: rgba(203, 213, 225, 0.6);
}

.capsule-tag:hover {
  background: linear-gradient(
    135deg,
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      calc(var(--capsule-lightness) + 25%),
      0.35
    ),
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      calc(var(--capsule-lightness) + 35%),
      0.25
    )
  );
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      var(--capsule-lightness),
      0.3
    );
}

.capsule-title {
  font-size: 1.125rem; /* 减少字体大小从1.25rem到1.125rem */
  font-weight: 600;
  color: var(--title-color);
  line-height: 1.3; /* 减少行高 */
  margin-bottom: 0.75rem; /* 减少下边距 */
  transition: all 0.3s ease;
}

.article-capsule:hover .capsule-title {
  color: var(--title-hover-color);
  transform: translateY(-1px);
}

.capsule-excerpt {
  color: var(--excerpt-color);
  font-size: 0.875rem; /* 减少字体大小 */
  line-height: 1.5; /* 减少行高 */
  margin-bottom: 1rem; /* 减少下边距 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 减少显示行数从3行到2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.article-capsule:hover .capsule-excerpt {
  color: var(--excerpt-hover-color);
}

/* 深浅主题文字样式 */
.dark-theme .capsule-title {
  --title-color: rgba(248, 250, 252, 0.95);
  --title-hover-color: rgba(248, 250, 252, 1);
}

.dark-theme .capsule-excerpt {
  --excerpt-color: rgba(203, 213, 225, 0.8);
  --excerpt-hover-color: rgba(203, 213, 225, 0.9);
}

/* 浅色主题文字样式 - 修复白色文字问题 */
.capsule-title {
  --title-color: rgba(30, 41, 59, 0.9);
  --title-hover-color: rgba(30, 41, 59, 1);
}

.capsule-excerpt {
  --excerpt-color: rgba(71, 85, 105, 0.8);
  --excerpt-hover-color: rgba(71, 85, 105, 0.9);
}

/* 元信息 */
.capsule-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem; /* 减少上边距 */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.capsule-date,
.capsule-read-time {
  font-size: 0.8rem;
  color: var(--meta-color);
}

.capsule-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--link-color);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.capsule-link:hover {
  color: var(--link-hover-color);
  transform: translateX(3px);
}

/* 深浅主题元信息样式 */
.dark-theme .capsule-date,
.dark-theme .capsule-read-time {
  --meta-color: rgba(148, 163, 184, 0.7);
}

.dark-theme .capsule-link {
  --link-color: rgba(129, 140, 248, 0.9);
  --link-hover-color: rgba(129, 140, 248, 1);
}

/* 浅色主题元信息样式 - 修复颜色问题 */
.capsule-date,
.capsule-read-time {
  --meta-color: rgba(100, 116, 139, 0.7);
}

.capsule-link {
  --link-color: rgba(59, 130, 246, 0.9);
  --link-hover-color: rgba(59, 130, 246, 1);
}

.link-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.capsule-link:hover .link-arrow {
  transform: translateX(3px);
}

/* 时间标记 */
.time-marker {
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: hsl(
    var(--capsule-hue),
    var(--capsule-saturation),
    var(--capsule-lightness)
  );
  box-shadow: 0 0 15px
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      var(--capsule-lightness),
      0.6
    );
  animation: dotPulse 2s ease-in-out infinite;
}

.marker-line {
  width: 2px;
  height: 40px;
  background: linear-gradient(
    to bottom,
    hsla(
      var(--capsule-hue),
      var(--capsule-saturation),
      var(--capsule-lightness),
      0.6
    ),
    transparent
  );
}

/* 动画 */
@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

@keyframes dotPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-capsule {
    max-width: 100%;
    margin: 0; /* 移除外边距 */
  }

  .capsule-cover {
    height: 100px; /* 进一步减少移动端封面高度 */
  }

  .capsule-info {
    padding: 0.875rem; /* 减少移动端内边距 */
  }

  .capsule-title {
    font-size: 1rem; /* 减少移动端标题字体大小 */
  }

  .capsule-excerpt {
    font-size: 0.8rem; /* 减少移动端摘要字体大小 */
    -webkit-line-clamp: 2; /* 保持2行显示 */
  }
}

.time-marker {
  display: none;
}
</style>

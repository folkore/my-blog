<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReadingProgress from "../components/ReadingProgress.vue";
import ShareButtons from "../components/ShareButtons.vue";
import CommentSection from "../components/CommentSection.vue";
import MarkdownRenderer from "../components/MarkdownRenderer.vue";
import TableOfContents from "../components/TableOfContents.vue";
import { useI18n } from "vue-i18n";
import { usePostsStore } from "../store";
import { parseMarkdown } from "../utils/markdown-loader";

let route, router, t, locale, postsStore;
let blogPost = ref(null);
let isLoading = ref(true);
let error = ref(null);
let postContent = ref(null);

try {
  route = useRoute();
  router = useRouter();
  const i18n = useI18n();
  t = i18n.t;
  locale = i18n.locale;
  postsStore = usePostsStore();
} catch (e) {
  error.value = "Component setup failed.";
  isLoading.value = false;
}

const articleRef = ref(null);
const markdownRef = ref(null);
const headings = ref([]);

onMounted(async () => {
  if (!postsStore) {
    isLoading.value = false;
    if (!error.value) error.value = "Store not available.";
    return;
  }

  try {
    const postSlug = route.params.id;
    const post = postsStore.getPostBySlug(postSlug);

    if (post) {
      blogPost.value = post;

      // 尝试从 Markdown 文件加载内容
      const content = await postsStore.getPostContent(post.slug);

      if (content) {
        // 解析 Markdown 内容
        const { content: markdownContent } = parseMarkdown(content);
        postContent.value = markdownContent;
      } else {
        // 如果没有找到对应的 Markdown 文件，显示错误
        error.value = t("blog.contentNotFound");
      }
    } else {
      error.value = t("blog.postNotFound");
    }

    isLoading.value = false;
  } catch (e) {
    console.error("Error loading post:", e);
    error.value = t("blog.loadError");
    isLoading.value = false;
  }

  // 等待内容渲染完成后获取标题数据
  await nextTick();
  if (markdownRef.value) {
    headings.value = markdownRef.value.headings;
  }
});

// 检查内容是否为 Markdown 格式
const isMarkdownContent = computed(() => {
  if (!postContent.value) return false;

  // 如果内容以 < 开头，可能是 HTML
  const content = postContent.value.trim();
  return !content.startsWith("<");
});

// 计算文章发布时间
const formattedDate = computed(() => {
  if (!blogPost.value) return "";
  return new Date(blogPost.value.date).toLocaleDateString(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// 计算文章阅读时间
const calculateReadTime = (content) => {
  if (!content) return `0 ${t("blog.readTimeSuffix")}`;
  // 假设平均阅读速度为每分钟200字
  const words = content.replace(/<[^>]*>/g, "").length / 2;
  const minutes = Math.ceil(words / 200);
  return `${minutes} ${t("blog.readTimeSuffix")}`;
};

// 返回博客列表
const backToList = () => {
  router.push("/blog");
};

// 处理添加评论
const handleCommentAdded = (newComment) => {
  if (blogPost.value) {
    if (!blogPost.value.comments) {
      blogPost.value.comments = [];
    }
    blogPost.value.comments.push(newComment);
  }
};
</script>

<template>
  <div class="blog-post-page">
    <!-- 文章专用阅读进度条 -->
    <ReadingProgress v-if="blogPost" target=".blog-post-content" />

    <!-- 固定返回按钮 -->
    <button
      class="floating-back-button"
      @click="backToList"
      :title="t('blog.backToList')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- 左箭头，与 BackToTop 图标风格保持一致 -->
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state container">
      <div class="spinner"></div>
      <p>{{ t("blog.loading") }}</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state container">
      <h2>{{ t("error.title") }}</h2>
      <p>{{ error }}</p>
      <button @click="backToList" class="btn btn-primary">
        {{ t("blog.backToList") }}
      </button>
    </div>

    <!-- 文章内容 -->
    <article
      v-if="blogPost && !isLoading && !error"
      ref="articleRef"
      class="blog-post-article"
    >
      <!-- 文章头部 -->
      <div class="container">
        <header class="blog-post-header">
          <div class="post-meta-top">
            <span class="post-category">{{ blogPost.tags[0] }}</span>
            <span class="separator">·</span>
            <span class="post-read-time">{{
              calculateReadTime(postContent)
            }}</span>
          </div>
          <h1 class="post-title">{{ blogPost.title }}</h1>
          <div class="post-meta-author">
            <img
              :src="blogPost.author.avatar"
              :alt="blogPost.author.name"
              class="author-avatar"
            />
            <div class="author-info">
              <span class="author-name">{{ blogPost.author.name }}</span>
              <span class="post-date">{{ formattedDate }}</span>
            </div>
          </div>
        </header>

        <div
          v-if="blogPost.cover"
          class="post-cover"
          :style="{ backgroundImage: `url(${blogPost.cover})` }"
        ></div>
      </div>

      <!-- 文章主体 -->
      <div class="post-content-wrapper">
        <div class="container">
          <div class="blog-post-content">
            <!-- Markdown 渲染 -->
            <MarkdownRenderer
              v-if="isMarkdownContent"
              ref="markdownRef"
              :content="postContent"
            />
            <!-- HTML 渲染 -->
            <div v-else v-html="postContent"></div>

            <!-- 文章底部 -->
            <div class="post-footer">
              <div class="post-tags">
                <span v-for="tag in blogPost.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
              <ShareButtons
                :url="`https://your-domain.com${route.path}`"
                :title="blogPost.title"
              />
            </div>

            <CommentSection
              :post-id="blogPost.id"
              :comments="blogPost.comments || []"
              @comment-added="handleCommentAdded"
            />
          </div>
        </div>

        <!-- 目录组件 -->
        <TableOfContents
          v-if="headings.length > 0"
          :headings="headings"
          class="toc-container"
        />
      </div>
    </article>
  </div>
</template>

<style scoped>
/* 基础布局 */
.blog-post-page {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  animation: fade-in 0.4s ease;
}

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

/* 目录基础定位，先全局固定到右上 */
.toc-container {
  position: fixed;
  top: 100px;
  right: 24px;
  width: 280px;
  z-index: 20;
}

/* 文章内容布局 */
.blog-post-content {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

/* 响应式覆盖 */
@media (max-width: 991px) {
  .toc-container {
    position: static;
    width: 100%;
    max-width: 100%;
    margin: 2rem 0;
    padding: 0 20px;
    top: auto;
    right: auto;
  }

  .blog-post-article {
    padding-right: 0;
  }
}

@media (min-width: 992px) {
  .post-content-wrapper {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* 为正文区域预留宽度 */
  .blog-post-article {
    max-width: 900px;
    padding-right: 340px;
  }

  .post-content-wrapper > .container {
    max-width: 900px;
  }
}

/* 其他样式保持不变 */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(
    var(--color-primary) 25%,
    transparent 0 50%,
    var(--color-primary-light) 0 75%,
    transparent 0
  );
  animation: spinner-rotate 1s linear infinite;
  margin-bottom: 16px;
  mask: radial-gradient(farthest-side, transparent 60%, #000 61%);
}

@keyframes spinner-rotate {
  100% {
    transform: rotate(360deg);
  }
}

.error-state h2 {
  font-size: 24px;
  color: var(--color-error, #e53e3e);
  margin-bottom: 16px;
}

.error-state p {
  color: var(--color-secondary-text);
  margin-bottom: 24px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.blog-post-article {
  max-width: 1080px;
  margin: 40px auto 0;
  padding: 0 20px;
}

.blog-post-header {
  margin-bottom: 30px;
  text-align: center;
}

.post-meta-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: var(--color-secondary-text);
  font-size: 14px;
}

.post-category {
  background-color: var(--color-tertiary-background);
  padding: 4px 12px;
  border-radius: 16px;
  color: var(--color-secondary-text);
}

.post-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
  color: var(--color-text);
}

.post-meta-author {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  text-align: left;
}

.author-name {
  font-weight: 500;
  color: var(--color-text);
  display: block;
}

.post-date {
  font-size: 14px;
  color: var(--color-secondary-text);
}

.post-cover {
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  height: 400px;
}

.post-content-wrapper {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 60px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  font-size: 14px;
  background-color: var(--color-tertiary-background);
  color: var(--color-secondary-text);
  padding: 6px 14px;
  border-radius: 16px;
  transition: background-color var(--transition-fast);
}

.tag:hover {
  background-color: var(--color-border);
}

@media (max-width: 768px) {
  .blog-post-article {
    padding: 0 16px;
  }

  .post-title {
    font-size: 32px;
  }

  .post-cover {
    height: 250px;
  }
}

/* 暗色主题下的调整 */
@media (prefers-color-scheme: dark) {
  .post-category,
  .tag {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

/* 页面淡入动画 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 固定返回按钮样式 */
.floating-back-button {
  position: fixed;
  bottom: 90px;
  right: 30px;
  z-index: 99;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--card-bg);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--card-shadow);
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  padding: 0;
}

.floating-back-button:hover {
  transform: translateY(-5px);
  background-color: var(--primary-color);
  color: white;
}

.floating-back-button svg {
  width: 24px;
  height: 24px;
}
</style>

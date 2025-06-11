<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReadingProgress from "../components/ReadingProgress.vue";
import ShareButtons from "../components/ShareButtons.vue";
import CommentSection from "../components/CommentSection.vue";
import { useI18n } from "vue-i18n";
import { usePostsStore } from "../store";

let route, router, t, locale, postsStore;
let blogPost = ref(null);
let isLoading = ref(true);
let error = ref(null);

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
    } else {
      error.value = t("blog.postNotFound");
    }

    isLoading.value = false;
  } catch (e) {
    error.value = t("blog.loadError");
    isLoading.value = false;
  }
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
  <div class="blog-post-page container">
    <!-- 文章专用阅读进度条 -->
    <ReadingProgress v-if="blogPost" target=".blog-post-content" />

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ t("blog.loading") }}</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state">
      <h2>{{ t("error.title") }}</h2>
      <p>{{ error }}</p>
      <button @click="backToList" class="btn btn-primary">
        {{ t("blog.backToList") }}
      </button>
    </div>

    <!-- 文章内容 -->
    <article
      v-if="blogPost && !isLoading"
      ref="articleRef"
      class="blog-post-article"
    >
      <header class="blog-post-header">
        <div class="post-meta-top">
          <span class="post-category">{{ blogPost.tags[0] }}</span>
          <span class="separator">·</span>
          <span class="post-read-time">{{
            calculateReadTime(blogPost.content)
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

      <div class="post-content-wrapper">
        <div class="blog-post-content" v-html="blogPost.content"></div>

        <div class="post-footer">
          <div class="post-tags">
            <span v-for="tag in blogPost.tags" :key="tag" class="tag">{{
              tag
            }}</span>
          </div>
          <ShareButtons
            :url="`https://your-domain.com${route.path}`"
            :title="blogPost.title"
          />
        </div>
      </div>

      <CommentSection
        :post-id="blogPost.id"
        :comments="blogPost.comments || []"
        @comment-added="handleCommentAdded"
      />
    </article>
  </div>
</template>

<style scoped>
.blog-post-page {
  padding: 60px 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  border: 4px solid var(--color-secondary-background);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
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
  max-width: 800px;
  margin: 40px auto 0;
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
}

.post-content {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text);
}

.post-content :deep(h2) {
  font-size: 28px;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 16px;
  color: var(--color-text);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.post-content :deep(h3) {
  font-size: 24px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 14px;
  color: var(--color-text);
}

.post-content :deep(p) {
  margin-bottom: 24px;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  margin-bottom: 24px;
  padding-left: 24px;
}

.post-content :deep(li) {
  margin-bottom: 8px;
}

.post-content :deep(pre) {
  background-color: var(--color-tertiary-background);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 24px;
}

.post-content :deep(code) {
  font-family: monospace;
  background-color: var(--color-tertiary-background);
  padding: 2px 4px;
  border-radius: 4px;
}

.post-content :deep(pre) > code {
  background-color: transparent;
  padding: 0;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
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
  .post-title {
    font-size: 32px;
  }
  .post-cover {
    height: 250px;
  }
}
</style>

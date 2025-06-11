<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReadingProgress from "../components/ReadingProgress.vue";
import ShareButtons from "../components/ShareButtons.vue";
import CommentSection from "../components/CommentSection.vue";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const isLoading = ref(true);
const error = ref(null);
const articleRef = ref(null);

// 用于强制组件重新渲染的标志
const forceUpdate = ref(false);

// 监听语言变化
watch(locale, () => {
  // 强制组件重新渲染
  forceUpdate.value = !forceUpdate.value;
});

// 监听语言变化事件
const handleLanguageChanged = () => {
  // 强制组件重新渲染
  forceUpdate.value = !forceUpdate.value;
};

// 模拟单篇博客文章数据
const blogPost = ref({
  id: 1,
  title: "开始使用 Vue 3 和组合式 API",
  cover: "https://picsum.photos/id/180/1200/600",
  content: `
    <p>Vue 3 带来了许多激动人心的新特性，其中最引人注目的是组合式 API。这种新的编写组件逻辑的方式解决了 Vue 2 中的一些限制，特别是在处理复杂组件时。</p>

    <h2>什么是组合式 API？</h2>
    <p>组合式 API（Composition API）是 Vue 3 中引入的一组 API，允许我们使用导入的函数而不是声明选项的方式来编写 Vue 组件。</p>

    <p>与 Vue 2 的选项式 API 相比，组合式 API 提供了更好的：</p>
    <ul>
      <li>逻辑组合与复用</li>
      <li>更灵活的代码组织</li>
      <li>更好的类型推断</li>
      <li>更小的打包体积</li>
    </ul>

    <h2>核心概念</h2>
    <p>组合式 API 的核心是几个基本函数：</p>

    <h3>1. ref 和 reactive</h3>
    <p>这两个函数用于创建响应式数据：</p>
    <pre><code>import { ref, reactive } from 'vue'

// 使用 ref 处理单个值
const count = ref(0)
console.log(count.value) // 需要使用 .value 访问

// 使用 reactive 处理对象
const state = reactive({
  count: 0,
  message: 'Hello'
})
console.log(state.count) // 直接访问属性</code></pre>

    <h3>2. computed 和 watch</h3>
    <p>用于创建计算属性和侦听器：</p>
    <pre><code>import { ref, computed, watch } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

watch(count, (newValue, oldValue) => {
  console.log('Count changed from', oldValue, 'to', newValue)
})</code></pre>

    <h3>3. 生命周期钩子</h3>
    <p>组合式 API 提供了一组等效于选项式 API 生命周期钩子的函数：</p>
    <pre><code>import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component is mounted!')
})

onUpdated(() => {
  console.log('Component is updated!')
})

onUnmounted(() => {
  console.log('Component is unmounted!')
})</code></pre>

    <h2>组合函数</h2>
    <p>组合式 API 的真正威力在于创建可复用的组合函数（composables）：</p>
    <pre><code>// useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    increment,
    decrement
  }
}</code></pre>

    <p>然后在组件中使用：</p>
    <pre><code>import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, increment, decrement } = useCounter()
    
    return {
      count,
      increment,
      decrement
    }
  }
}</code></pre>

    <p>或者在 &lt;script setup&gt; 中：</p>
    <pre><code>&lt;script setup&gt;
import { useCounter } from './useCounter'

const { count, increment, decrement } = useCounter()
&lt;/script&gt;</code></pre>

    <h2>结语</h2>
    <p>组合式 API 为 Vue 开发引入了一种全新的范式，虽然可能需要一些时间来适应，但它在大型应用程序和复杂组件中的优势是显而易见的。</p>
    
    <p>无论您是 Vue 新手还是经验丰富的开发者，学习组合式 API 都将为您的 Vue 开发之旅增添新的维度。</p>
  `,
  date: "2023-06-15",
  readTime: "8 分钟",
  author: {
    name: "张三",
    avatar: "https://picsum.photos/id/1012/200/200",
    bio: "前端开发工程师，Vue.js 爱好者",
  },
  tags: ["Vue", "JavaScript", "前端开发"],
  comments: [
    {
      id: 101,
      author: "李四",
      avatar: "https://picsum.photos/id/1005/100/100",
      date: "2023-06-16",
      content: "非常详细的指南，对我理解组合式 API 很有帮助！",
    },
    {
      id: 102,
      author: "王五",
      avatar: "https://picsum.photos/id/1006/100/100",
      date: "2023-06-17",
      content:
        "我最近正在从 Vue 2 迁移到 Vue 3，这篇文章让我对组合式 API 有了更清晰的认识。",
    },
  ],
  relatedPosts: [
    {
      id: 2,
      title: "Vue 3 中的 Teleport 和 Suspense 组件",
      summary: "探索 Vue 3 中新增的两个强大组件及其使用场景。",
      cover: "https://picsum.photos/id/1/400/200",
    },
    {
      id: 3,
      title: "使用 Vite 构建 Vue 3 项目",
      summary: "了解 Vite 如何改变前端构建体验，以及如何与 Vue 3 结合使用。",
      cover: "https://picsum.photos/id/2/400/200",
    },
  ],
});

// 在实际应用中，这里应该根据路由参数从 API 获取博客文章
onMounted(async () => {
  // 添加语言变化事件监听
  window.addEventListener("language-changed", handleLanguageChanged);

  try {
    const postId = parseInt(route.params.id);

    // 模拟 API 请求延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 这里应该是实际的 API 调用
    // const response = await fetch(`/api/posts/${postId}`);
    // blogPost.value = await response.json();

    // 为了演示，我们只调整 ID
    blogPost.value = {
      ...blogPost.value,
      id: postId,
    };

    isLoading.value = false;
  } catch (e) {
    error.value = "加载文章失败，请稍后再试";
    isLoading.value = false;
    console.error(e);
  }
});

onUnmounted(() => {
  // 移除语言变化事件监听
  window.removeEventListener("language-changed", handleLanguageChanged);
});

// 计算文章发布时间
const formattedDate = computed(() => {
  if (!blogPost.value) return "";
  return blogPost.value.date;
});

// 计算文章阅读时间
const calculateReadTime = (content) => {
  // 假设平均阅读速度为每分钟200字
  const words = content.replace(/<[^>]*>/g, "").length / 2;
  const minutes = Math.ceil(words / 200);
  return `${minutes} 分钟`;
};

// 返回博客列表
const backToList = () => {
  router.push("/blog");
};

// 处理添加评论
const handleCommentAdded = (newComment) => {
  blogPost.value.comments.push(newComment);
};
</script>

<template>
  <div class="blog-post-page container">
    <!-- 文章专用阅读进度条 -->
    <ReadingProgress target=".blog-post-content" />

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ t("blog.loadingArticle") }}</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-container">
      <p>{{ t("blog.loadError") }}</p>
    </div>

    <!-- 文章内容 -->
    <article v-else class="blog-post" ref="articleRef">
      <!-- 返回按钮 -->
      <div class="back-link">
        <a @click.prevent="backToList" href="#">← 返回文章列表</a>
      </div>

      <!-- 文章标题 -->
      <header class="post-header">
        <h1 class="post-title">{{ blogPost.title }}</h1>
        <div class="post-meta">
          <div class="author-info">
            <img
              v-if="blogPost.author"
              :src="blogPost.author.avatar"
              :alt="blogPost.author.name"
              class="author-avatar"
            />
            <div class="author-details">
              <span class="author-name">{{ blogPost.author.name }}</span>
              <span class="post-date"
                >{{ t("blog.publishedOn") }} {{ formattedDate }}</span
              >
              <span class="read-time">{{
                t("blog.readTime", {
                  minutes: calculateReadTime(blogPost.content),
                })
              }}</span>
            </div>
          </div>
          <div class="post-tags">
            <span
              v-for="(tag, index) in blogPost.tags"
              :key="index"
              class="post-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <!-- 文章封面图 -->
      <div class="post-cover">
        <img
          v-lazy="blogPost.cover"
          :alt="blogPost.title"
          class="cover-image"
        />
      </div>

      <!-- 文章内容 -->
      <div class="blog-post-content" v-html="blogPost.content"></div>

      <!-- 分享按钮 -->
      <ShareButtons
        :title="blogPost.title"
        :description="
          blogPost.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        "
      />

      <!-- 作者信息 -->
      <div class="author-bio">
        <img
          v-lazy="blogPost.author.avatar"
          :alt="blogPost.author.name"
          class="author-avatar"
        />
        <div class="author-details">
          <h3>{{ blogPost.author.name }}</h3>
          <p>{{ blogPost.author.bio }}</p>
        </div>
      </div>

      <!-- 评论区 -->
      <CommentSection
        :comments="blogPost.comments"
        :post-id="blogPost.id"
        @comment-added="handleCommentAdded"
      />

      <!-- 相关文章 -->
      <div class="related-posts">
        <h2>{{ t("post.relatedPosts") }}</h2>
        <div class="related-posts-grid">
          <div
            v-for="post in blogPost.relatedPosts"
            :key="post.id"
            class="related-post-card"
            @click="router.push(`/blog/${post.id}`)"
          >
            <div class="related-post-image">
              <img v-lazy="post.cover" :alt="post.title" />
            </div>
            <div class="related-post-content">
              <h3>{{ post.title }}</h3>
              <p>{{ post.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.blog-post-page {
  padding: 60px 0;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  border: 4px solid var(--color-secondary-background);
  border-top: 4px solid var(--color-link);
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

.error-container p {
  color: var(--color-error);
  margin-bottom: 20px;
  font-size: 18px;
}

.back-link {
  margin-bottom: 20px;
}

.back-link a {
  color: var(--color-link);
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.back-link a:hover {
  text-decoration: underline;
}

.post-header {
  margin-bottom: 30px;
}

.post-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
  color: var(--color-text);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: var(--color-text);
}

.post-details {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-secondary-text);
}

.post-date::after {
  content: "•";
  margin-left: 10px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.post-tag {
  font-size: 14px;
  background-color: var(--color-secondary-background);
  color: var(--color-text);
  padding: 6px 14px;
  border-radius: 100px;
}

.post-cover {
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

.post-content {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text);
}

/* 样式注入以支持文章内容中的 HTML */
.post-content :deep(h2) {
  font-size: 28px;
  font-weight: 600;
  margin-top: 40px;
  margin-bottom: 16px;
  color: var(--color-text);
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
  background-color: var(--color-secondary-background);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 24px;
}

.post-content :deep(code) {
  font-family: monospace;
}

/* 作者信息 */
.author-bio {
  display: flex;
  gap: 20px;
  margin: 60px 0;
  padding: 30px;
  background-color: var(--color-secondary-background);
  border-radius: 12px;
}

.author-bio .author-avatar {
  width: 80px;
  height: 80px;
}

.author-details h3 {
  font-size: 14px;
  color: var(--color-secondary-text);
  margin-bottom: 4px;
}

.author-details h4 {
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--color-text);
}

.author-details p {
  font-size: 16px;
  color: var(--color-secondary-text);
}

/* 评论区 */
.comments-section {
  margin-bottom: 60px;
}

.comments-section h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: var(--color-text);
}

.comments-list {
  margin-bottom: 40px;
}

.comment {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border);
}

.comment-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.comment-author {
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.comment-date {
  font-size: 14px;
  color: var(--color-secondary-text);
}

.comment-text {
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-secondary-text);
}

.no-comments {
  text-align: center;
  padding: 30px 0;
  color: var(--color-secondary-text);
}

/* 评论表单 */
.comment-form-container {
  background-color: var(--color-secondary-background);
  padding: 30px;
  border-radius: 12px;
}

.comment-form-container h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: var(--color-text);
}

.comment-form .form-group {
  margin-bottom: 16px;
}

.comment-form .form-row {
  display: flex;
  gap: 16px;
}

.comment-form .form-row .form-group {
  flex: 1;
}

.comment-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text);
}

.comment-form input,
.comment-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 16px;
}

.comment-form textarea {
  resize: vertical;
}

.comment-form button {
  margin-top: 8px;
}

/* 相关文章 */
.related-posts-section {
  margin-top: 60px;
}

.related-posts-section h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: var(--color-text);
}

.related-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.related-post-card {
  background-color: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px var(--color-shadow);
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px var(--color-shadow);
}

.related-post-image {
  height: 150px;
  overflow: hidden;
}

.related-post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-post-content {
  padding: 16px;
}

.related-post-content h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--color-text);
}

.related-post-content p {
  font-size: 14px;
  color: var(--color-secondary-text);
  line-height: 1.5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .post-title {
    font-size: 32px;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .post-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .post-date::after {
    content: "";
  }

  .author-bio {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .comment-form .form-row {
    flex-direction: column;
  }

  .related-posts {
    grid-template-columns: 1fr;
  }
}
</style>

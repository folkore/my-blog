<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import GitHubLogin from "./GitHubLogin.vue";
import LoadingState from "./LoadingState.vue";
import ErrorMessage from "./ErrorMessage.vue";
import githubComments from "../services/github-comments.js";
import { useNetworkStatus } from "../composables/useNetworkStatus.js";

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  postId: {
    type: [Number, String],
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["comment-added", "comments-loaded"]);

const newComment = ref({
  content: "",
});

const isSubmitting = ref(false);
const isLoading = ref(false);
const errors = ref({});
const submitSuccess = ref(false);
const githubComments_list = ref([]);
const issueNumber = ref(null);
const currentUser = ref(null);
const useGitHub = ref(false);
const lastSubmittedContent = ref(""); // 记录最后提交的内容，防止重复提交

const { t } = useI18n();
const { isOnline, retryRequest } = useNetworkStatus();

// 计算属性
const allComments = computed(() => {
  return useGitHub.value ? githubComments_list.value : props.comments;
});

const commentCount = computed(() => allComments.value.length);

const isGitHubConfigured = computed(() => githubComments.isConfigured());

const canComment = computed(() => {
  if (!useGitHub.value) return true;
  return !!currentUser.value && isOnline.value;
});

const submitButtonText = computed(() => {
  if (isSubmitting.value) return t("buttons.submitting");
  if (!isOnline.value) return "网络连接不可用";
  return t("blog.submitComment");
});

const isSubmitDisabled = computed(() => {
  return (
    isSubmitting.value ||
    !isOnline.value ||
    (useGitHub.value && !currentUser.value)
  );
});

// 初始化GitHub评论系统
const initializeGitHub = async () => {
  if (!isGitHubConfigured.value) {
    useGitHub.value = false;
    return;
  }

  useGitHub.value = true;
  await loadGitHubComments();
};

// 加载GitHub评论
const loadGitHubComments = async () => {
  if (!isGitHubConfigured.value) return;

  isLoading.value = true;
  try {
    // 检查网络状态
    if (!isOnline.value) {
      throw new Error("网络连接不可用");
    }

    // 使用重试机制查找或创建Issue
    issueNumber.value = await retryRequest(
      () => githubComments.findOrCreateIssue(props.postTitle, props.postUrl),
      3,
      1000
    );

    // 使用重试机制获取评论列表
    const comments = await retryRequest(
      () => githubComments.getComments(issueNumber.value),
      3,
      1000
    );

    githubComments_list.value = comments;

    // GitHub评论系统使用自己的数据管理，不需要通知父组件
    // emit("comments-loaded", comments);
  } catch (error) {
    console.error("Failed to load GitHub comments:", error);

    // 根据错误类型决定是否降级
    if (!isOnline.value) {
      errors.value.submit = "网络连接不可用，请检查网络设置";
    } else if (error.message?.includes("rate limit")) {
      errors.value.submit = "GitHub API 请求频率限制，请稍后再试";
    } else {
      // 其他错误降级到本地评论系统
      console.warn("降级到本地评论系统:", error.message);
      useGitHub.value = false;
    }
  } finally {
    isLoading.value = false;
  }
};

// 验证评论表单
const validateForm = () => {
  const formErrors = {};

  if (!newComment.value.content.trim()) {
    formErrors.content = "请输入评论内容";
  }

  errors.value = formErrors;
  return Object.keys(formErrors).length === 0;
};

// 处理用户登录
const handleUserLogin = (user) => {
  currentUser.value = user;
};

// 提交评论
const submitComment = async () => {
  if (!validateForm()) return;

  // 防止重复提交
  if (isSubmitting.value) return;

  // GitHub评论系统下检查登录状态
  if (useGitHub.value && !currentUser.value) {
    errors.value.submit = "请先登录GitHub账号";
    return;
  }

  // 检查是否与上次提交的内容相同（防止重复提交相同内容）
  if (lastSubmittedContent.value === newComment.value.content.trim()) {
    console.warn("防止重复提交相同内容");
    return;
  }

  isSubmitting.value = true;
  errors.value = {};

  // 记录当前提交的内容
  const currentContent = newComment.value.content.trim();
  lastSubmittedContent.value = currentContent;

  try {
    if (useGitHub.value && issueNumber.value) {
      // 再次确认登录状态和写入权限
      if (!githubComments.hasWriteAccess()) {
        throw new Error("没有GitHub写入权限，请检查配置");
      }

      // 检查网络状态
      if (!isOnline.value) {
        throw new Error("网络连接不可用，请检查您的网络设置");
      }

      // 使用重试机制提交到GitHub
      const newCommentObj = await retryRequest(
        () =>
          githubComments.addComment(
            issueNumber.value,
            newComment.value.content
          ),
        3,
        1000
      );

      // 检查是否已存在相同ID的评论，避免重复添加
      const existingComment = githubComments_list.value.find(
        (c) => c.id === newCommentObj.id
      );
      if (!existingComment) {
        githubComments_list.value.push(newCommentObj);
        // GitHub评论系统不需要向父组件emit事件，因为数据由githubComments_list管理
        // emit("comment-added", newCommentObj);
      }
    } else {
      // 本地评论系统（原有逻辑）
      const newCommentObj = {
        id: Date.now(),
        author: "匿名用户",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          "匿名用户"
        )}&background=random`,
        date: new Date().toLocaleDateString(),
        content: newComment.value.content,
      };

      // 只有本地评论系统才需要向父组件emit事件
      emit("comment-added", newCommentObj);
    }

    // 重置表单
    newComment.value = {
      content: "",
    };

    submitSuccess.value = true;
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);

    // 延迟重置lastSubmittedContent，给用户一些时间看到成功消息
    setTimeout(() => {
      lastSubmittedContent.value = "";
    }, 5000);
  } catch (error) {
    console.error("提交评论失败:", error);
    errors.value.submit = error.message || "提交评论失败，请稍后再试";
  } finally {
    isSubmitting.value = false;
  }
};

// 组件挂载时初始化
onMounted(() => {
  initializeGitHub();
});
</script>

<template>
  <section class="comments-section">
    <!-- 评论系统状态指示 -->
    <div v-if="useGitHub" class="github-indicator">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        />
      </svg>
      <span>{{ t("comments.poweredByGitHub") }}</span>
      <a
        v-if="issueNumber"
        :href="`https://github.com/${githubComments.owner}/${githubComments.repo}/issues/${issueNumber}`"
        target="_blank"
        class="github-link"
      >
        {{ t("comments.viewOnGitHub") }}
      </a>
    </div>

    <h2>{{ t("blog.commentCount", { count: commentCount }) }}</h2>

    <!-- 加载状态 -->
    <LoadingState
      v-if="isLoading"
      :loading="isLoading"
      :message="t('comments.loadingComments')"
      type="dots"
      size="medium"
    />

    <!-- 评论列表 -->
    <div v-else-if="allComments.length === 0" class="no-comments">
      <p>{{ t("blog.noComments") }}</p>
    </div>

    <div v-else class="comments-list">
      <div v-for="comment in allComments" :key="comment.id" class="comment">
        <div class="comment-avatar">
          <img :src="comment.avatar" :alt="comment.author" />
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <h4 class="comment-author">
              <a
                v-if="useGitHub && comment.githubUrl"
                :href="comment.githubUrl"
                target="_blank"
                class="author-link"
              >
                {{ comment.author }}
              </a>
              <span v-else>{{ comment.author }}</span>
            </h4>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <div
            v-if="useGitHub && comment.htmlContent"
            class="comment-text"
            v-html="comment.htmlContent"
          ></div>
          <p v-else class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- 评论表单 -->
    <div class="comment-form-container">
      <h3>{{ t("blog.postComment") }}</h3>

      <!-- GitHub 登录组件 -->
      <GitHubLogin v-if="useGitHub" @login="handleUserLogin" />

      <!-- 评论表单 -->
      <form
        v-if="canComment"
        class="comment-form"
        @submit.prevent="submitComment"
      >
        <div class="form-group">
          <label for="comment">{{ t("blog.commentContent") }}</label>
          <textarea
            id="comment"
            v-model="newComment.content"
            name="comment"
            rows="4"
            :placeholder="
              useGitHub
                ? t('comments.githubCommentPlaceholder')
                : t('blog.commentPlaceholder')
            "
            :class="{ 'error-input': errors.content }"
          ></textarea>
          <span v-if="errors.content" class="error-message">{{
            errors.content
          }}</span>
          <div v-if="useGitHub" class="markdown-tip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {{ t("comments.markdownSupported") }}
          </div>
        </div>

        <!-- 网络状态提示 -->
        <div v-if="!isOnline" class="network-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          网络连接不可用，请检查您的网络设置
        </div>

        <!-- 提交错误信息 -->
        <ErrorMessage
          v-if="errors.submit"
          :error="errors.submit"
          type="error"
          @dismiss="errors.submit = ''"
          compact
        />

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitDisabled"
          :class="{ 'btn-disabled': isSubmitDisabled }"
        >
          <span v-if="isSubmitting">
            <div class="button-spinner"></div>
            {{ t("buttons.submitting") }}...
          </span>
          <span v-else>{{ submitButtonText }}</span>
        </button>

        <div v-if="submitSuccess" class="success-message">
          {{ t("blog.commentSuccess") }}
        </div>
      </form>

      <!-- 无法评论的提示 -->
      <div v-else-if="useGitHub && !currentUser" class="login-required">
        <p>{{ t("comments.loginRequired") }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.comments-section {
  margin-top: 4rem;
  padding: 2.5rem 0;
  border-top: 1px solid var(--color-border);
  position: relative;
}

.comments-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-primary-light, #8b5cf6)
  );
  border-radius: 2px;
}

/* GitHub 指示器 */
.github-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem 1.25rem;
  background: var(--color-secondary-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--color-secondary-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.github-indicator:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-0.5px);
}

.github-indicator svg {
  color: var(--color-primary);
  transition: transform 0.2s ease;
}

.github-indicator:hover svg {
  transform: scale(1.05);
}

.github-link {
  margin-left: auto;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(var(--color-primary-rgb, 99, 102, 241), 0.08);
}

.github-link:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-0.5px);
  box-shadow: 0 3px 8px rgba(var(--color-primary-rgb, 99, 102, 241), 0.25);
}

.comments-section h2 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  background: linear-gradient(
    135deg,
    var(--color-text),
    var(--color-secondary-text)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 加载状态 */
.loading-comments {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-secondary-text);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 网络状态警告 */
.network-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--radius-md);
  color: #d97706;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

/* 按钮禁用状态 */
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-disabled:hover {
  transform: none !important;
  background: var(--color-primary) !important;
}

.no-comments {
  padding: 3rem 2rem;
  background: var(--color-secondary-background);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  text-align: center;
  color: var(--color-secondary-text);
  position: relative;
  overflow: hidden;
}

.no-comments::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-rgb, 99, 102, 241), 0.03) 0%,
    transparent 70%
  );
  animation: float 6s ease-in-out infinite;
}

.no-comments p {
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
  margin: 0;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

.comments-list {
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  display: flex;
  gap: 1.25rem;
  padding: 1.75rem;
  background: var(--color-secondary-background);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.comment::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-primary-light, #8b5cf6)
  );
  opacity: 0;
  transition: opacity 0.2s ease;
}

.comment:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  border-color: rgba(var(--color-primary-rgb, 99, 102, 241), 0.3);
}

.comment:hover::before {
  opacity: 0.6;
}

.comment-avatar {
  flex-shrink: 0;
  position: relative;
}

/* 取消头像框悬浮高亮阴影 */
.comment-avatar::after {
  display: none !important;
}

.comment-avatar img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-background);
  transition: transform 0.2s ease;
}

.comment:hover .comment-avatar img {
  transform: scale(1.02);
}

.comment-content {
  flex-grow: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.comment-author {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
}

.author-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.author-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-primary-light, #8b5cf6)
  );
  transition: width 0.3s ease;
}

.author-link:hover::after {
  width: 100%;
}

.author-link:hover {
  color: var(--color-primary);
  transform: translateY(-0.5px);
}

.comment-date {
  font-size: 0.875rem;
  color: var(--color-secondary-text);
  font-weight: 500;
  background: var(--color-background);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  white-space: nowrap;
  flex-shrink: 0;
}

.comment-text {
  margin: 0;
  line-height: 1.7;
  color: var(--color-text);
  font-size: 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* GitHub HTML 内容样式 */
.comment-text :deep(h1),
.comment-text :deep(h2),
.comment-text :deep(h3),
.comment-text :deep(h4),
.comment-text :deep(h5),
.comment-text :deep(h6) {
  margin: 1rem 0 0.5rem 0;
  color: var(--color-text);
}

.comment-text :deep(p) {
  margin: 0.5rem 0;
}

.comment-text :deep(code) {
  background: var(--color-secondary-background);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9em;
}

.comment-text :deep(pre) {
  background: var(--color-secondary-background);
  padding: 1rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 0.5rem 0;
}

.comment-text :deep(blockquote) {
  border-left: 4px solid var(--color-border);
  padding-left: 1rem;
  margin: 0.5rem 0;
  color: var(--color-secondary-text);
}

.comment-text :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
}

.comment-text :deep(a:hover) {
  text-decoration: underline;
}

.comment-form-container {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--color-secondary-background);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.comment-form-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-primary-light, #8b5cf6)
  );
}

.comment-form-container h3 {
  margin-bottom: 1.5rem;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.comment-form-container h3::before {
  content: "💬";
  font-size: 1.25rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  /* 整体布局优化 */
  .comments-section {
    margin-top: 2.5rem;
    padding: 1.5rem 0;
  }

  .comments-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* GitHub指示器移动端优化 */
  .github-indicator {
    padding: 0.875rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .github-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }

  /* 评论列表移动端优化 */
  .comments-list {
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .comment {
    padding: 1rem;
    gap: 0.875rem;
    border-radius: 12px;
  }

  .comment-avatar img {
    width: 40px;
    height: 40px;
    border-width: 2px;
  }

  .comment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .comment-author {
    font-size: 1rem;
    line-height: 1.2;
  }

  .comment-date {
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
    border-radius: 8px;
  }

  .comment-text {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* 表单容器移动端优化 */
  .comment-form-container {
    padding: 1.25rem;
    margin-top: 2rem;
    border-radius: 16px;
  }

  .comment-form-container h3 {
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
  }

  .comment-form {
    gap: 1.25rem;
  }

  .form-row {
    flex-direction: column;
  }

  .form-group label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .form-group input,
  .form-group textarea {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
    min-height: 100px;
  }

  .form-group textarea {
    line-height: 1.5;
  }

  /* 按钮移动端优化 */
  .btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
    border-radius: 10px;
    min-height: 44px;
  }

  /* Markdown提示移动端优化 */
  .markdown-tip {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  /* 网络警告移动端优化 */
  .network-warning {
    padding: 0.625rem;
    font-size: 0.85rem;
    gap: 0.375rem;
  }

  /* 成功/错误消息移动端优化 */
  .success-message {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }

  .error-message {
    font-size: 0.8rem;
  }

  /* 无评论状态移动端优化 */
  .no-comments {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }

  .no-comments p {
    font-size: 1rem;
  }

  /* 登录提示移动端优化 */
  .login-required {
    padding: 1.5rem;
    border-radius: 12px;
  }

  .login-required p {
    font-size: 1rem;
  }
}

.form-group label {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group label::before {
  content: "✏️";
  font-size: 0.875rem;
}

.form-group input,
.form-group textarea {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 2px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  resize: vertical;
  min-height: 120px;
}

.form-group textarea {
  line-height: 1.6;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 99, 102, 241), 0.08);
  transform: translateY(-0.5px);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--color-secondary-text);
  opacity: 0.8;
}

.error-input {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: "⚠️";
  font-size: 0.875rem;
}

.success-message {
  color: #10b981;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.1),
    rgba(16, 185, 129, 0.05)
  );
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: slideInUp 0.3s ease;
}

.success-message::before {
  content: "✅";
  font-size: 1.125rem;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 1rem 2rem;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 48px;
}

.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.15),
    transparent
  );
  transition: left 0.6s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-light, #8b5cf6)
  );
  color: white;
  box-shadow: 0 4px 16px rgba(var(--color-primary-rgb, 99, 102, 241), 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(var(--color-primary-rgb, 99, 102, 241), 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* GitHub 特定样式 */
.markdown-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--color-secondary-text);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  border-left: 3px solid var(--color-primary);
}

.markdown-tip svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.submit-error {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.1),
    rgba(239, 68, 68, 0.05)
  );
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  animation: slideInUp 0.3s ease;
}

.login-required {
  padding: 2rem;
  background: var(--color-secondary-background);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  text-align: center;
  color: var(--color-secondary-text);
  position: relative;
  overflow: hidden;
}

.login-required::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(var(--color-primary-rgb, 99, 102, 241), 0.03) 0%,
    transparent 70%
  );
  animation: float 8s ease-in-out infinite;
}

.login-required p {
  position: relative;
  z-index: 1;
  font-size: 1.1rem;
  margin: 0;
}

.button-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 添加底部间距修复 */
.comment-form-container {
  margin-bottom: 2rem;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .comment {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .comment:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  }

  .github-indicator {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .github-indicator:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  .btn-primary {
    box-shadow: 0 4px 16px rgba(var(--color-primary-rgb, 99, 102, 241), 0.2);
  }

  .btn-primary:hover {
    box-shadow: 0 6px 20px rgba(var(--color-primary-rgb, 99, 102, 241), 0.25);
  }
}
</style>

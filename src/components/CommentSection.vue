<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  postId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["comment-added"]);

const newComment = ref({
  name: "",
  email: "",
  content: "",
});

const isSubmitting = ref(false);
const errors = ref({});
const submitSuccess = ref(false);

// 验证评论表单
const validateForm = () => {
  const formErrors = {};

  if (!newComment.value.name.trim()) {
    formErrors.name = "请输入您的名字";
  }

  if (!newComment.value.email.trim()) {
    formErrors.email = "请输入您的邮箱";
  } else if (!isValidEmail(newComment.value.email)) {
    formErrors.email = "请输入有效的邮箱地址";
  }

  if (!newComment.value.content.trim()) {
    formErrors.content = "请输入评论内容";
  }

  errors.value = formErrors;
  return Object.keys(formErrors).length === 0;
};

// 验证邮箱格式
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 提交评论
const submitComment = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // 在实际应用中，这里应该是一个API请求
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newCommentObj = {
      id: Date.now(),
      author: newComment.value.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        newComment.value.name
      )}&background=random`,
      date: new Date().toLocaleDateString(),
      content: newComment.value.content,
    };

    // 触发评论添加事件
    emit("comment-added", newCommentObj);

    // 重置表单
    newComment.value = {
      name: "",
      email: "",
      content: "",
    };

    submitSuccess.value = true;
    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error("提交评论失败:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// 计算评论数量
const commentCount = computed(() => props.comments.length);
</script>

<template>
  <section class="comments-section">
    <h2>评论 ({{ commentCount }})</h2>

    <!-- 评论列表 -->
    <div v-if="comments.length === 0" class="no-comments">
      <p>暂无评论，来发表第一条评论吧！</p>
    </div>

    <div v-else class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <div class="comment-avatar">
          <img v-lazy="comment.avatar" :alt="comment.author" />
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <h4 class="comment-author">{{ comment.author }}</h4>
            <span class="comment-date">{{ comment.date }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- 评论表单 -->
    <div class="comment-form-container">
      <h3>发表评论</h3>
      <form class="comment-form" @submit.prevent="submitComment">
        <div class="form-group">
          <label for="comment">评论内容</label>
          <textarea
            id="comment"
            v-model="newComment.content"
            name="comment"
            rows="4"
            placeholder="分享你的想法..."
            :class="{ 'error-input': errors.content }"
          ></textarea>
          <span v-if="errors.content" class="error-message">{{
            errors.content
          }}</span>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="name">名字</label>
            <input
              type="text"
              id="name"
              v-model="newComment.name"
              name="name"
              placeholder="你的名字"
              :class="{ 'error-input': errors.name }"
            />
            <span v-if="errors.name" class="error-message">{{
              errors.name
            }}</span>
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input
              type="email"
              id="email"
              v-model="newComment.email"
              name="email"
              placeholder="你的邮箱（不会公开）"
              :class="{ 'error-input': errors.email }"
            />
            <span v-if="errors.email" class="error-message">{{
              errors.email
            }}</span>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">提交中...</span>
          <span v-else>提交评论</span>
        </button>
        <div v-if="submitSuccess" class="success-message">评论提交成功！</div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.comments-section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.no-comments {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  text-align: center;
  color: var(--text-secondary);
}

.comments-list {
  margin-bottom: 2rem;
}

.comment {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.comment:last-child {
  border-bottom: none;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  flex-grow: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.comment-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.comment-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
}

.comment-form-container {
  margin-top: 2rem;
}

.comment-form-container h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }
}

.form-group label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.error-input {
  border-color: #dc3545 !important;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.success-message {
  color: #28a745;
  font-size: 0.95rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(40, 167, 69, 0.1);
  border-radius: 4px;
  text-align: center;
}

.btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

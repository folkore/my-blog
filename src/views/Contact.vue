<script setup>
import { ref } from "vue";

// 表单数据
const form = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

// 表单状态
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errors = ref({});

// 表单验证
const validateForm = () => {
  const newErrors = {};

  if (!form.value.name.trim()) {
    newErrors.name = "请输入您的姓名";
  }

  if (!form.value.email.trim()) {
    newErrors.email = "请输入您的邮箱";
  } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
    newErrors.email = "请输入有效的邮箱地址";
  }

  if (!form.value.subject.trim()) {
    newErrors.subject = "请输入主题";
  }

  if (!form.value.message.trim()) {
    newErrors.message = "请输入留言内容";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    // 模拟 API 调用
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 在实际应用中，这里应该是实际的 API 调用
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(form.value)
    // });

    // 重置表单
    form.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    // 显示成功消息
    isSubmitted.value = true;

    // 3秒后恢复表单
    setTimeout(() => {
      isSubmitted.value = false;
    }, 3000);
  } catch (error) {
    console.error("提交表单出错:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="contact-page container">
    <header class="page-header">
      <h1>联系我</h1>
      <p class="subtitle">有问题或者项目合作？请随时联系我</p>
    </header>

    <div class="contact-layout">
      <section class="contact-info">
        <div class="info-card">
          <h3>联系信息</h3>

          <div class="info-item">
            <div class="info-icon">
              <i class="icon-email">✉️</i>
            </div>
            <div class="info-content">
              <h4>邮箱</h4>
              <a href="mailto:contact@example.com">contact@example.com</a>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon">
              <i class="icon-location">📍</i>
            </div>
            <div class="info-content">
              <h4>位置</h4>
              <p>中国，北京</p>
            </div>
          </div>

          <div class="social-links">
            <h4>社交媒体</h4>
            <div class="social-icons">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="social-icon"
              >
                GitHub
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="social-icon"
              >
                LinkedIn
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="social-icon"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="contact-form-section">
        <div class="form-card">
          <h3>发送消息</h3>

          <div v-if="isSubmitted" class="success-message">
            <p>✓ 感谢您的留言！我会尽快回复您。</p>
          </div>

          <form v-else class="contact-form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">姓名</label>
              <input
                type="text"
                id="name"
                v-model="form.name"
                :class="{ 'error-input': errors.name }"
                placeholder="您的姓名"
              />
              <p class="error-text" v-if="errors.name">{{ errors.name }}</p>
            </div>

            <div class="form-group">
              <label for="email">邮箱</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                :class="{ 'error-input': errors.email }"
                placeholder="您的邮箱"
              />
              <p class="error-text" v-if="errors.email">{{ errors.email }}</p>
            </div>

            <div class="form-group">
              <label for="subject">主题</label>
              <input
                type="text"
                id="subject"
                v-model="form.subject"
                :class="{ 'error-input': errors.subject }"
                placeholder="消息主题"
              />
              <p class="error-text" v-if="errors.subject">
                {{ errors.subject }}
              </p>
            </div>

            <div class="form-group">
              <label for="message">留言</label>
              <textarea
                id="message"
                v-model="form.message"
                :class="{ 'error-input': errors.message }"
                placeholder="您想说的话..."
                rows="6"
              ></textarea>
              <p class="error-text" v-if="errors.message">
                {{ errors.message }}
              </p>
            </div>

            <button
              type="submit"
              class="button primary-button submit-button"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">发送中...</span>
              <span v-else>发送消息</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  padding: 60px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}

.subtitle {
  font-size: 20px;
  color: var(--color-secondary-text);
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}

/* 联系信息部分 */
.contact-info {
  display: flex;
  flex-direction: column;
}

.info-card {
  background-color: var(--color-secondary-background);
  border-radius: 16px;
  padding: 30px;
  height: 100%;
}

.info-card h3 {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--color-text);
}

.info-item {
  display: flex;
  margin-bottom: 24px;
  gap: 16px;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 20px;
}

.info-content {
  flex: 1;
}

.info-content h4 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--color-text);
}

.info-content a,
.info-content p {
  font-size: 16px;
  color: var(--color-secondary-text);
  text-decoration: none;
}

.info-content a:hover {
  color: var(--color-link);
  text-decoration: underline;
}

.social-links h4 {
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--color-text);
}

.social-icons {
  display: flex;
  gap: 16px;
}

.social-icon {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 980px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background-color: var(--color-link);
  color: white;
  transform: translateY(-2px);
}

/* 联系表单部分 */
.form-card {
  background-color: var(--color-background);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 15px var(--color-shadow);
}

.form-card h3 {
  font-size: 24px;
  margin-bottom: 30px;
  color: var(--color-text);
}

.contact-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 16px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-link);
}

.error-input {
  border-color: var(--color-error) !important;
}

.error-text {
  color: var(--color-error);
  font-size: 14px;
  margin-top: 4px;
}

.submit-button {
  padding: 16px 24px;
  font-size: 18px;
  align-self: flex-start;
}

.success-message {
  background-color: #e6f7e6;
  border-left: 4px solid #28a745;
  padding: 16px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.success-message p {
  color: #28a745;
  font-size: 16px;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .page-header h1 {
    font-size: 36px;
  }

  .submit-button {
    width: 100%;
  }
}
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import LoadingState from "./LoadingState.vue";
import ErrorMessage from "./ErrorMessage.vue";
import { useGitHubAuth } from "../composables/useGitHubAuth.js";

const props = defineProps({
  onLogin: {
    type: Function,
    default: () => {},
  },
});

const { t } = useI18n();

// 使用新的GitHub认证组合式函数
const {
  currentUser,
  isLoading,
  error,
  isLoggedIn,
  hasWriteAccess,
  startOAuthLogin,
  logout: authLogout,
  initializeAuth,
  fetchCurrentUser,
} = useGitHubAuth();

const loadingMessage = ref("");
const retryCount = ref(0);

// 检查是否配置了OAuth服务器
const hasOAuthConfig = computed(() => {
  const oauthServerUrl = import.meta.env.VITE_OAUTH_SERVER_URL;
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  return !!(oauthServerUrl || githubClientId);
});

// 登录按钮文本
const loginButtonText = computed(() => {
  return hasOAuthConfig.value ? t("auth.loginWithGitHub") : "获取用户信息";
});

// 重试获取用户信息
const retryFetchUser = async () => {
  loadingMessage.value = "正在重试获取用户信息...";
  try {
    await fetchCurrentUser();
    retryCount.value = 0;
  } catch (err) {
    retryCount.value++;
    console.error("Retry fetch user failed:", err);
  }
};

// GitHub OAuth 登录
const loginWithGitHub = async () => {
  if (hasOAuthConfig.value) {
    // 使用新的OAuth流程
    await startOAuthLogin();
  } else if (hasWriteAccess.value) {
    // 兼容模式：使用Personal Access Token
    loadingMessage.value = "正在获取用户信息...";
    await fetchCurrentUser();
  } else {
    error.value = "未配置GitHub OAuth应用或Personal Access Token";
  }
};

// 登出
const logout = () => {
  authLogout();
  retryCount.value = 0;
  // 通知父组件用户已退出登录
  props.onLogin(null);
};

// 监听用户状态变化
const handleUserChange = (user) => {
  if (user) {
    props.onLogin(user);
  }
};

onMounted(async () => {
  // 初始化认证状态
  await initializeAuth();

  // 如果有用户信息，通知父组件
  if (currentUser.value) {
    handleUserChange(currentUser.value);
  }
});
</script>

<template>
  <div class="github-login">
    <!-- 加载状态 -->
    <LoadingState
      v-if="isLoading"
      :loading="isLoading"
      :message="loadingMessage || t('common.loading')"
      type="spinner"
      size="small"
    />

    <!-- 错误信息 -->
    <ErrorMessage
      v-if="error && !isLoading"
      :error="error"
      type="error"
      :show-retry="retryCount < 3"
      retry-text="重试"
      @retry="retryFetchUser"
      @dismiss="error = ''"
    />

    <!-- 已登录状态 -->
    <div v-if="isLoggedIn" class="logged-in-state">
      <div class="user-info">
        <img
          :src="currentUser.avatar"
          :alt="currentUser.name || currentUser.login"
          class="user-avatar"
        />
        <div class="user-details">
          <span class="user-name">{{
            currentUser.name || currentUser.login
          }}</span>
          <span class="user-login">@{{ currentUser.login }}</span>
        </div>
      </div>
      <button @click="logout" class="logout-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        {{ t("auth.logout") }}
      </button>
    </div>

    <!-- 未登录状态 -->
    <div v-else-if="hasWriteAccess" class="login-prompt">
      <p class="login-description">{{ t("comments.githubLoginPrompt") }}</p>
      <button @click="loginWithGitHub" class="github-login-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
        {{ loginButtonText }}
      </button>
    </div>

    <!-- 无写入权限提示 -->
    <div v-else class="no-access-message">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {{ t("comments.readOnlyMode") }}
    </div>
  </div>
</template>

<style scoped>
.github-login {
  margin-bottom: 1rem;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-secondary-background);
  border-radius: var(--radius-md);
  color: var(--color-secondary-text);
}

.spinner {
  width: 16px;
  height: 16px;
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

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
  color: #dc2626;
  font-size: 0.9rem;
}

.logged-in-state {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-secondary-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.user-login {
  font-size: 0.8rem;
  color: var(--color-secondary-text);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-secondary-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.logout-btn:hover {
  background: var(--color-tertiary-background);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.login-prompt {
  padding: 1rem;
  background: var(--color-secondary-background);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  text-align: center;
}

.login-description {
  margin: 0 0 1rem 0;
  color: var(--color-secondary-text);
  font-size: 0.9rem;
}

.github-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #24292e;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.github-login-btn:hover {
  background: #1a1e22;
  transform: translateY(-1px);
}

.no-access-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-md);
  color: #2563eb;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .logged-in-state {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .user-info {
    justify-content: center;
  }
}
</style>

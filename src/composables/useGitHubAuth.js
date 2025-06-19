import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// OAuth服务器配置
const OAUTH_SERVER_URL = import.meta.env.VITE_OAUTH_SERVER_URL || 'http://localhost:3002';

// 全局状态
const currentUser = ref(null);
const accessToken = ref(localStorage.getItem('github_access_token') || null);
const isLoading = ref(false);
const error = ref('');

/**
 * GitHub OAuth 认证组合式函数
 */
export function useGitHubAuth() {
  
  // 计算属性
  const isLoggedIn = computed(() => !!currentUser.value && !!accessToken.value);
  const hasWriteAccess = computed(() => !!accessToken.value);
  
  /**
   * 启动OAuth登录流程
   */
  const startOAuthLogin = async () => {
    isLoading.value = true;
    error.value = '';
    
    try {
      // 获取OAuth授权URL
      const response = await axios.get(`${OAUTH_SERVER_URL}/auth/github`);
      const { authUrl, state } = response.data;
      
      // 保存state用于验证
      localStorage.setItem('github_oauth_state', state);
      
      // 重定向到GitHub授权页面
      window.location.href = authUrl;
      
    } catch (err) {
      console.error('Failed to start OAuth login:', err);
      error.value = '启动登录流程失败，请稍后重试';
      isLoading.value = false;
    }
  };
  
  /**
   * 处理OAuth回调
   */
  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const token = urlParams.get('access_token');
    const userData = urlParams.get('user_data');
    const errorParam = urlParams.get('error');
    const errorMessage = urlParams.get('message');
    
    if (oauthSuccess === 'true' && token && userData) {
      try {
        // 解析用户数据
        const user = JSON.parse(userData);
        
        // 保存认证信息
        accessToken.value = token;
        currentUser.value = user;
        localStorage.setItem('github_access_token', token);
        localStorage.setItem('github_user_data', userData);
        
        // 清理URL参数
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        console.log('OAuth login successful:', user);
        return true;
        
      } catch (err) {
        console.error('Failed to parse OAuth callback data:', err);
        error.value = '登录数据解析失败';
        return false;
      }
    } else if (errorParam) {
      error.value = errorMessage || '登录失败，请重试';
      console.error('OAuth error:', errorParam, errorMessage);
      return false;
    }
    
    return false;
  };
  
  /**
   * 验证现有token
   */
  const verifyToken = async (token) => {
    if (!token) return false;

    try {
      // 对于Personal Access Token模式，直接通过GitHub API验证
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.data) {
        const userData = {
          id: response.data.id,
          login: response.data.login,
          name: response.data.name || response.data.login,
          avatar: response.data.avatar_url, // 使用 avatar 字段名以匹配组件
          avatar_url: response.data.avatar_url, // 保留原字段名以兼容
          email: response.data.email
        };

        currentUser.value = userData;
        accessToken.value = token;
        localStorage.setItem('github_access_token', token);
        localStorage.setItem('github_user_data', JSON.stringify(userData));
        return true;
      }

      return false;

    } catch (err) {
      console.error('Token verification failed:', err);
      return false;
    }
  };
  
  /**
   * 获取当前用户信息（优先使用Personal Access Token模式）
   */
  const fetchCurrentUser = async () => {
    // 优先尝试使用环境变量中的Personal Access Token
    const envToken = import.meta.env.VITE_GITHUB_TOKEN;
    if (envToken) {
      const isValid = await verifyToken(envToken);
      if (isValid) {
        console.log('Using Personal Access Token mode');
        return;
      }
    }

    // 如果环境变量token无效，尝试已保存的OAuth token
    if (accessToken.value && accessToken.value !== envToken) {
      const isValid = await verifyToken(accessToken.value);
      if (isValid) return;
    }

    // 清理无效的认证信息
    logout();
  };
  
  /**
   * 登出
   */
  const logout = () => {
    currentUser.value = null;
    accessToken.value = null;
    localStorage.removeItem('github_access_token');
    localStorage.removeItem('github_user_data');
    localStorage.removeItem('github_oauth_state');
    error.value = '';
    console.log('User logged out');
  };
  
  /**
   * 获取当前用户的访问令牌（供GitHub API使用）
   */
  const getCurrentToken = () => {
    return accessToken.value || import.meta.env.VITE_GITHUB_TOKEN;
  };
  
  /**
   * 初始化认证状态
   */
  const initializeAuth = async () => {
    isLoading.value = true;
    
    try {
      // 检查是否是OAuth回调
      if (window.location.search.includes('oauth_success') || window.location.search.includes('error')) {
        const success = handleOAuthCallback();
        if (success) {
          isLoading.value = false;
          return;
        }
      }
      
      // 尝试从localStorage恢复用户状态
      const savedUserData = localStorage.getItem('github_user_data');
      const savedToken = localStorage.getItem('github_access_token');
      
      if (savedUserData && savedToken) {
        try {
          currentUser.value = JSON.parse(savedUserData);
          accessToken.value = savedToken;
          
          // 验证token是否仍然有效
          const isValid = await verifyToken(savedToken);
          if (!isValid) {
            logout();
          }
        } catch (err) {
          console.error('Failed to restore user session:', err);
          logout();
        }
      } else {
        // 尝试获取用户信息（兼容模式）
        await fetchCurrentUser();
      }
      
    } catch (err) {
      console.error('Failed to initialize auth:', err);
      error.value = '初始化认证状态失败';
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    // 状态
    currentUser,
    accessToken,
    isLoading,
    error,
    
    // 计算属性
    isLoggedIn,
    hasWriteAccess,
    
    // 方法
    startOAuthLogin,
    logout,
    getCurrentToken,
    initializeAuth,
    fetchCurrentUser,
    verifyToken
  };
}

/**
 * GitHub Issues 评论系统服务
 * 使用GitHub Issues API作为评论后端
 */

import axios from 'axios';

class GitHubCommentsService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.owner = import.meta.env.VITE_GITHUB_OWNER || '';
    this.repo = import.meta.env.VITE_GITHUB_REPO || '';
    this.staticToken = import.meta.env.VITE_GITHUB_TOKEN || '';

    // 创建axios实例
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Blog-Comment-System'
      }
    });

    // 请求拦截器 - 动态添加认证头
    this.api.interceptors.request.use(
      (config) => {
        // 获取当前用户的token
        const currentToken = this.getCurrentToken();
        if (currentToken) {
          config.headers.Authorization = `token ${currentToken}`;
        }
        console.log('GitHub API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('GitHub API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        console.log('GitHub API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('GitHub API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取当前用户的访问令牌
   * 优先使用OAuth token，回退到静态token
   */
  getCurrentToken() {
    // 优先使用localStorage中的OAuth token
    const oauthToken = localStorage.getItem('github_access_token');
    if (oauthToken) {
      return oauthToken;
    }

    // 回退到环境变量中的静态token
    return this.staticToken;
  }

  /**
   * 检查是否有写入权限
   */
  hasWriteAccess() {
    return !!this.getCurrentToken();
  }

  /**
   * 验证配置是否完整
   */
  validateConfig() {
    if (!this.owner || !this.repo) {
      throw new Error('GitHub owner and repo must be configured');
    }
  }

  /**
   * 根据文章标题查找或创建对应的Issue
   * @param {string} postTitle - 文章标题
   * @param {string} postUrl - 文章URL
   * @returns {Promise<number>} Issue编号
   */
  async findOrCreateIssue(postTitle, postUrl) {
    this.validateConfig();

    try {
      // 先尝试直接获取仓库的所有Issues，然后在客户端过滤
      // 这样可以避免复杂的搜索查询导致的422错误
      let issueNumber = null;

      try {
        // 获取仓库中带有blog-comment标签的Issues
        const issuesResponse = await this.api.get(`/repos/${this.owner}/${this.repo}/issues`, {
          params: {
            labels: 'blog-comment',
            state: 'open',
            sort: 'created',
            direction: 'desc',
            per_page: 100
          }
        });

        // 在客户端查找匹配的Issue
        const matchingIssue = issuesResponse.data.find(issue =>
          issue.title.includes(postTitle) || issue.title.includes(`Comments for: ${postTitle}`)
        );

        if (matchingIssue) {
          issueNumber = matchingIssue.number;
        }
      } catch (searchError) {
        console.warn('Failed to search existing issues:', searchError);
        // 如果搜索失败，继续创建新Issue
      }

      if (issueNumber) {
        return issueNumber;
      }

      // 如果没有找到，创建新的Issue
      const currentToken = this.getCurrentToken();
      if (!currentToken) {
        throw new Error('GitHub token is required to create issues');
      }

      const createResponse = await this.api.post(`/repos/${this.owner}/${this.repo}/issues`, {
        title: `Comments for: ${postTitle}`,
        body: `This issue is used to collect comments for the blog post: [${postTitle}](${postUrl})\n\n---\n\n**Please use the comment form on the blog to add comments.**`,
        labels: ['blog-comment']
      });

      return createResponse.data.number;
    } catch (error) {
      console.error('Error finding or creating issue:', error);
      throw error;
    }
  }

  /**
   * 获取Issue的评论列表
   * @param {number} issueNumber - Issue编号
   * @returns {Promise<Array>} 评论列表
   */
  async getComments(issueNumber) {
    this.validateConfig();

    try {
      const response = await this.api.get(`/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`, {
        params: {
          sort: 'created',
          direction: 'asc',
          per_page: 100
        }
      });

      return response.data.map(comment => ({
        id: comment.id,
        author: comment.user.login,
        avatar: comment.user.avatar_url,
        date: new Date(comment.created_at).toLocaleDateString('zh-CN'),
        content: comment.body,
        htmlContent: comment.body_html || comment.body,
        githubUrl: comment.html_url,
        createdAt: comment.created_at,
        updatedAt: comment.updated_at
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (error.response?.status === 404) {
        return []; // Issue不存在，返回空评论列表
      }
      throw error;
    }
  }

  /**
   * 添加评论到Issue
   * @param {number} issueNumber - Issue编号
   * @param {string} content - 评论内容
   * @returns {Promise<Object>} 新评论对象
   */
  async addComment(issueNumber, content) {
    this.validateConfig();

    const currentToken = this.getCurrentToken();
    if (!currentToken) {
      throw new Error('GitHub token is required to add comments');
    }

    try {
      const response = await this.api.post(`/repos/${this.owner}/${this.repo}/issues/${issueNumber}/comments`, {
        body: content
      });

      return {
        id: response.data.id,
        author: response.data.user.login,
        avatar: response.data.user.avatar_url,
        date: new Date(response.data.created_at).toLocaleDateString('zh-CN'),
        content: response.data.body,
        htmlContent: response.data.body_html || response.data.body,
        githubUrl: response.data.html_url,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * 获取GitHub用户信息
   * @returns {Promise<Object>} 用户信息
   */
  async getCurrentUser() {
    const currentToken = this.getCurrentToken();
    if (!currentToken) {
      return null;
    }

    try {
      const response = await this.api.get('/user');
      return {
        login: response.data.login,
        name: response.data.name,
        avatar: response.data.avatar_url,
        url: response.data.html_url
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }

  /**
   * 检查是否已配置GitHub
   * @returns {boolean}
   */
  isConfigured() {
    return !!(this.owner && this.repo);
  }

  /**
   * 检查是否有写入权限（有token）
   * @returns {boolean}
   */
  hasWriteAccess() {
    return !!this.getCurrentToken();
  }
}

// 创建单例实例
export const githubComments = new GitHubCommentsService();
export default githubComments;

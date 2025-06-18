import { defineStore } from 'pinia';
import { loadMarkdownContent } from '../utils/markdown-loader';
import { postsMeta } from '../utils/posts-meta';

// 博客文章状态管理
export const usePostsStore = defineStore('posts', {
  state: () => ({
    // 文章元数据列表
    posts: postsMeta,
    
    // 缓存文章内容
    postContents: {},
    
    // 搜索相关状态
    searchStatus: {
      contentsLoaded: false,
      isInitialized: false
    }
  }),

  getters: {
    // 获取所有文章
    getAllPosts: (state) => state.posts,

    // 通过ID获取文章
    getPostById: (state) => (id) => {
      return state.posts.find(post => post.id === parseInt(id));
    },

    // 通过 Slug 获取文章
    getPostBySlug: (state) => (slug) => {
      // 先通过数字 ID 尝试查找
      if (!isNaN(parseInt(slug))) {
        return state.posts.find(post => post.id === parseInt(slug));
      }
      
      // 如果不是数字，则通过 slug 查找
      return state.posts.find(post => post.slug === slug);
    },

    // 获取所有标签
    getAllTags: (state) => {
      const tagsSet = new Set();
      state.posts.forEach(post => {
        post.tags.forEach(tag => tagsSet.add(tag));
      });
      return Array.from(tagsSet);
    },

    // 通过标签筛选文章
    getPostsByTag: (state) => (tag) => {
      return state.posts.filter(post => post.tags.includes(tag));
    },

    // 获取文章关键词
    getPostKeywords: (state) => (slug) => {
      const post = state.posts.find(post => post.slug === slug);
      return post?.keywords || [];
    }
  },

  actions: {
    // 获取文章内容
    async getPostContent(slug) {
      // 如果已经有缓存，直接返回
      if (this.postContents[slug]) {
        return this.postContents[slug];
      }
      
      try {
        // 加载 Markdown 文件内容
        const content = await loadMarkdownContent(slug);
        
        if (content) {
          // 缓存内容
          this.postContents[slug] = content;
          return content;
        }
        
        return null;
      } catch (error) {
        console.error('Failed to load post content:', error);
        return null;
      }
    },
    
    // 预加载所有文章内容（用于搜索）
    async preloadAllContents() {
      if (this.searchStatus.contentsLoaded) return true;
      
      try {
        // 并行加载所有文章内容
        const loadPromises = this.posts.map(post => 
          this.getPostContent(post.slug).catch(err => {
            console.warn(`Failed to preload content for ${post.slug}:`, err);
            return null;
          })
        );
        
        await Promise.all(loadPromises);
        this.searchStatus.contentsLoaded = true;
        return true;
      } catch (error) {
        console.error('Failed to preload all contents:', error);
        return false;
      }
    },
    
    // 添加新文章
    addPost(post) {
      const newId = this.posts.length > 0 
        ? Math.max(...this.posts.map(p => p.id)) + 1 
        : 1;
      
      this.posts.push({
        id: newId,
        ...post
      });
    },

    // 更新文章
    updatePost(updatedPost) {
      const index = this.posts.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) {
        this.posts[index] = { ...updatedPost };
      }
    },

    // 删除文章
    deletePost(id) {
      const index = this.posts.findIndex(p => p.id === id);
      if (index !== -1) {
        this.posts.splice(index, 1);
      }
    },
    
    // 设置搜索初始化状态
    setSearchInitialized(value = true) {
      this.searchStatus.isInitialized = value;
    }
  }
}); 
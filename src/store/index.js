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

    // 搜索文章
    searchPosts: (state) => (query) => {
      const searchTerm = query.toLowerCase();
      return state.posts.filter(post => {
        return (
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm)
        );
      });
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
    }
  }
}); 
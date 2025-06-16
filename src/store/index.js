import { defineStore } from 'pinia';
import { loadMarkdownContent, parseMarkdown } from '../utils/markdown-loader';

// 博客文章状态管理
export const usePostsStore = defineStore('posts', {
  state: () => ({
    // 文章元数据列表
    posts: [
      {
        id: 9,
        title: '早上喝美式咖啡真的能减肥吗？科学分析告诉你答案！☕️✨',
        slug: 'healthy-weight-loss-americano-coffee-analysis',
        cover: "https://picsum.photos/id/188/1200/600",
        author: {
          name: "健康生活达人",
          avatar: "https://picsum.photos/id/1017/200/200",
          bio: "健康减肥专家，咖啡爱好者",
        },
        date: '2025-6-16',
        tags: ['健康减肥', '美式咖啡', '科学减肥', '生活方式', '健康饮食'],
        excerpt: '深度分析早上喝美式咖啡对减肥的影响，从科学角度解读咖啡因的代谢作用，分享实用的健康减肥小贴士和注意事项。'
      },
      {
        id: 7,
        title: 'Markdown 格式文章示例',
        slug: 'markdown-example',
        cover: "https://picsum.photos/id/186/1200/600",
        author: {
          name: "李四",
          avatar: "https://picsum.photos/id/1013/200/200",
          bio: "全栈工程师，热爱开源",
        },
        date: '2024-03-22',
        tags: ['Markdown', '教程', '前端技术'],
        excerpt: '这篇文章展示了 Markdown 的各种语法和格式化选项，包括标题、列表、代码块、表格和其他高级特性。'
      },
      {
        id: 6,
        title: '使用 GitHub Actions 自动部署 Vue 项目到 GitHub Pages',
        slug: 'github-pages-auto-deploy',
        cover: "https://picsum.photos/id/185/1200/600",
        author: {
          name: "张三",
          avatar: "https://picsum.photos/id/1012/200/200",
          bio: "前端开发工程师，Vue.js 爱好者",
        },
        date: '2024-03-21',
        tags: ['GitHub Actions', 'Vue.js', 'CI/CD', '自动部署'],
        excerpt: '详细介绍如何使用 GitHub Actions 将 Vue.js 项目自动部署到 GitHub Pages，包括配置过程和常见问题解决方案。'
      },
      {
        id: 1,
        title: '开始使用 Vue 3 和组合式 API',
        slug: 'vue3-composition-api',
        cover: "https://picsum.photos/id/180/1200/600",
        author: {
          name: "张三",
          avatar: "https://picsum.photos/id/1012/200/200",
          bio: "前端开发工程师，Vue.js 爱好者",
        },
        date: '2023-06-15',
        tags: ['Vue', 'JavaScript', '前端开发'],
        excerpt: 'Vue 3 引入了组合式 API，它提供了一种更灵活的方式来组织组件逻辑...'
      },
      {
        id: 2,
        title: 'Vue Router 4 新特性详解',
        slug: 'vue-router-4-features',
        cover: "https://picsum.photos/id/181/1200/600",
        author: {
          name: "李四",
          avatar: "https://picsum.photos/id/1013/200/200",
          bio: "全栈工程师，热爱开源",
        },
        date: '2023-07-05',
        tags: ['Vue Router', 'Vue', '前端开发'],
        excerpt: 'Vue Router 4是专为Vue 3设计的路由库。它提供了许多新功能和改进...'
      },
      {
        id: 3,
        title: 'Pinia: Vue 的下一代状态管理库',
        slug: 'pinia-state-management',
        cover: "https://picsum.photos/id/182/1200/600",
        author: {
          name: "王五",
          avatar: "https://picsum.photos/id/1014/200/200",
          bio: "UI/UX 设计师，关注用户体验",
        },
        date: '2023-08-12',
        tags: ['Pinia', 'Vue', '状态管理', '前端开发'],
        excerpt: 'Pinia 是 Vue 的官方状态管理库，旨在替代 Vuex。它提供了更简单的 API...'
      },
      {
        id: 4,
        title: '使用 Vite 加速前端开发',
        slug: 'vite-frontend-development',
        cover: "https://picsum.photos/id/183/1200/600",
        author: {
          name: "赵六",
          avatar: "https://picsum.photos/id/1015/200/200",
          bio: "DevOps 专家，热衷于自动化",
        },
        date: '2023-09-20',
        tags: ['Vite', '前端工具', 'JavaScript', '前端开发'],
        excerpt: 'Vite 是一个现代前端构建工具，由 Vue 的创建者尤雨溪开发...'
      },
      {
        id: 5,
        title: 'CSS 变量在主题切换中的应用',
        slug: 'css-variables-theming',
        cover: "https://picsum.photos/id/184/1200/600",
        author: {
          name: "孙七",
          avatar: "https://picsum.photos/id/1016/200/200",
          bio: "CSS 艺术家，对设计系统有深入研究",
        },
        date: '2023-10-08',
        tags: ['CSS', '主题', '前端开发'],
        excerpt: 'CSS 变量（自定义属性）为 Web 开发提供了强大的主题定制能力...'
      }
    ],
    
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
import { defineStore } from 'pinia';

// 博客文章状态管理
export const usePostsStore = defineStore('posts', {
  state: () => ({
    // 博客文章列表
    posts: [
      {
        id: 1,
        title: '开始使用 Vue 3 和组合式 API',
        cover: "https://picsum.photos/id/180/1200/600",
        content: 'Vue 3 引入了组合式 API，它提供了一种更灵活的方式来组织组件逻辑。与Vue 2的选项式API不同，组合式API允许我们按照逻辑关注点组织代码，而不是按选项类型。这使得代码更加可读、可维护和可重用。',
        path: '/blog/vue3-composition-api',
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
        cover: "https://picsum.photos/id/181/1200/600",
        content: 'Vue Router 4是专为Vue 3设计的路由库。它提供了许多新功能和改进，如更好的TypeScript支持、组合式API集成和更好的性能。在本文中，我们将深入探讨Vue Router 4的新特性，以及如何在Vue 3项目中有效地使用它们。',
        path: '/blog/vue-router-4-features',
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
        cover: "https://picsum.photos/id/182/1200/600",
        content: 'Pinia 是 Vue 的官方状态管理库，旨在替代 Vuex。它提供了更简单的 API、更好的 TypeScript 支持和模块化设计，无需创建复杂的模块树。Pinia 原生支持 Vue 3 的组合式 API，同时也与 Vue 2 兼容。在本文中，我们将学习如何使用 Pinia 来管理 Vue 应用程序的状态。',
        path: '/blog/pinia-state-management',
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
        cover: "https://picsum.photos/id/183/1200/600",
        content: 'Vite 是一个现代前端构建工具，由 Vue 的创建者尤雨溪开发。它利用 ES 模块的特性提供了极快的开发服务器启动和模块热更新。与传统的 webpack 相比，Vite 不需要在开发过程中打包整个应用，而是按需编译。这大大缩短了开发时的加载时间和提高了开发体验。',
        path: '/blog/vite-frontend-development',
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
        cover: "https://picsum.photos/id/184/1200/600",
        content: 'CSS 变量（自定义属性）为 Web 开发提供了强大的主题定制能力。通过定义和使用 CSS 变量，我们可以轻松创建和切换网站的多种主题，如亮色和暗色模式。这种方法比传统的主题切换方案更加灵活和可维护，因为它避免了重复的 CSS 规则和复杂的类名切换。',
        path: '/blog/css-variables-theming',
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
  }),

  getters: {
    // 获取所有文章
    getAllPosts: (state) => state.posts,

    // 通过ID获取文章
    getPostById: (state) => (id) => {
      return state.posts.find(post => post.id === parseInt(id));
    },

    getPostBySlug: (state) => (slug) => {
      return state.posts.find(post => post.id === parseInt(slug));
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
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm)
        );
      });
    }
  },

  actions: {
    // 添加新文章
    addPost(post) {
      this.posts.push({
        id: this.posts.length + 1,
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
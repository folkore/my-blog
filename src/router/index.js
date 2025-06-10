import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { 
      title: '首页',
      transition: 'zoom'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { 
      title: '关于',
      transition: 'fade'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue'),
    meta: { 
      title: '文章列表',
      transition: 'slide'
    }
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: () => import('../views/BlogPost.vue'),
    meta: { 
      title: '文章详情',
      transition: 'fade'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: { 
      title: '联系我',
      transition: 'slide'
    }
  },
  {
    path: '/language-test',
    name: 'LanguageTest',
    component: () => import('../views/LanguageTest.vue'),
    meta: { 
      title: '语言测试',
      transition: 'fade'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { 
      title: '页面未找到',
      transition: 'fade'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果存在保存的位置（例如用户使用浏览器的后退按钮），则恢复到该位置
      return savedPosition
    } else if (to.hash) {
      // 如果URL中有锚点，则滚动到锚点位置
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      // 否则滚动到顶部
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// 更新页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 个人博客` : '个人博客'
  next()
})

export default router 
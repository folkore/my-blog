---
title: Vue Router 4 新特性详解
date: 2023-07-05
tags: ['Vue Router', 'Vue', '前端开发']
description: Vue Router 4 是专为 Vue 3 设计的路由库，带来了许多新特性和改进。本文详细介绍了这些变化以及如何利用新特性构建更强大的应用。
---

# Vue Router 4 新特性详解

Vue Router 4 是专为 Vue 3 设计的官方路由库，它带来了许多新特性和改进，使路由管理更加灵活和强大。本文将详细介绍这些新特性并提供实用示例。

[[toc]]

## Vue Router 4 的主要变化

Vue Router 4 相比于 Vue Router 3 有以下主要变化：

1. **完全支持组合式 API**：提供了一系列路由相关的组合式函数
2. **改进的导航守卫**：更强大的导航控制和元信息管理
3. **动态路由增强**：更灵活的路由添加和删除
4. **TypeScript 支持**：提供更好的类型支持和类型安全
5. **新的历史记录 API**：支持 `history.state` 的新实现

> [!NOTE]
> Vue Router 4 仅支持 Vue 3，如果你仍在使用 Vue 2，则需要继续使用 Vue Router 3。

## 安装和基本设置

### 安装

```bash
# 使用 npm
npm install vue-router@4

# 使用 yarn
yarn add vue-router@4

# 使用 pnpm
pnpm add vue-router@4
```

### 基本设置

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

## 组合式 API 的使用

Vue Router 4 提供了一系列组合式 API 函数，让你可以在 `setup` 函数中访问路由信息：

### 使用 useRouter 和 useRoute

```vue
<script setup>
import { useRouter, useRoute } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 获取当前路由
const route = useRoute()

// 使用路由参数
console.log(route.params.id)

// 编程式导航
function navigateToHome() {
  router.push('/')
}

function goBack() {
  router.back()
}

function navigateWithParams() {
  router.push({
    name: 'UserProfile',
    params: { id: 123 }
  })
}

function navigateWithQuery() {
  router.push({
    path: '/search',
    query: { keyword: 'vue' }
  })
}
</script>
```

### 监听路由变化

```vue
<script setup>
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()
const userData = ref(null)

// 方法一：使用 watch 监听路由变化
watch(
  () => route.params.id,
  async (newId) => {
    userData.value = await fetchUserData(newId)
  },
  { immediate: true }
)

// 方法二：使用路由守卫
onBeforeRouteUpdate(async (to, from) => {
  if (to.params.id !== from.params.id) {
    userData.value = await fetchUserData(to.params.id)
  }
})

async function fetchUserData(id) {
  // 获取用户数据的逻辑
  return { id, name: `User ${id}` }
}
</script>
```

## 动态路由

Vue Router 4 提供了更灵活的动态路由管理，可以在运行时添加或删除路由：

### 添加路由

```javascript
// 添加顶级路由
router.addRoute({
  path: '/new-route',
  name: 'NewRoute',
  component: NewRouteComponent
})

// 添加嵌套路由
router.addRoute('Parent', {
  path: 'child',
  name: 'Child',
  component: ChildComponent
})
```

### 删除路由

```javascript
// 方法一：通过名称删除
router.removeRoute('RouteName')

// 方法二：添加路由时获取返回的删除函数
const removeRoute = router.addRoute(route)
removeRoute() // 删除刚才添加的路由
```

### 检查路由是否存在

```javascript
router.hasRoute('RouteName') // 检查路由是否存在
router.getRoutes() // 获取所有路由记录
```

## 导航守卫的改进

### 全局守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from) => {
  // 检查用户是否已登录，如果没有，则重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return {
      path: '/login',
      query: { redirect: to.fullPath }
    }
  }
})

// 全局解析守卫
router.beforeResolve(async (to) => {
  // 在导航被确认前，处理需要确认的操作
  if (to.meta.requiresConfirmation) {
    const confirmed = await showConfirmDialog()
    if (!confirmed) return false
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 发送页面浏览事件到分析服务
  sendAnalytics(to.fullPath)
})
```

### 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from) => {
      // 路由独享的导航守卫
      if (!isAdmin()) return '/403'
    }
  }
]
```

### 组件内守卫

在组合式 API 中，Vue Router 4 提供了 `onBeforeRouteUpdate` 和 `onBeforeRouteLeave` 钩子：

```vue
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// 在当前组件路由更新前调用
onBeforeRouteUpdate((to, from) => {
  // 处理路由参数变化等
})

// 在离开当前组件对应的路由前调用
onBeforeRouteLeave((to, from) => {
  // 例如，在用户有未保存的更改时显示确认对话框
  const hasUnsavedChanges = checkUnsavedChanges()
  
  if (hasUnsavedChanges) {
    const confirmed = confirm('您有未保存的更改，确定要离开吗？')
    if (!confirmed) return false
  }
})
</script>
```

## 路由元信息和类型

### 路由元信息

Vue Router 4 中的路由元信息（meta）可以附加到路由上，用于存储自定义数据：

```javascript
const routes = [
  {
    path: '/admin/posts',
    component: PostList,
    meta: { 
      requiresAuth: true,
      role: 'admin',
      transitionName: 'fade',
      title: '文章列表'
    }
  }
]
```

在组件中访问路由元信息：

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(route.meta.title) // '文章列表'
console.log(route.meta.requiresAuth) // true
</script>
```

### TypeScript 支持

Vue Router 4 对 TypeScript 提供了更好的支持，可以为路由元信息定义类型：

```typescript
// router.ts
import { RouteRecordRaw, createRouter } from 'vue-router'

// 声明路由元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    role?: 'admin' | 'user' | 'guest'
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      role: 'admin', // TypeScript 会进行类型检查
      title: 'Admin Dashboard'
    }
  }
]
```

## 历史记录模式

Vue Router 4 支持三种历史记录模式：

### HTML5 历史记录模式

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/base-directory/'), // 可选的基础路径
  routes
})
```

### Hash 模式

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

### 内存模式（SSR）

```javascript
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes
})
```

## 命名视图

Vue Router 4 继续支持命名视图，允许在同一个路由位置展示多个视图：

```javascript
const routes = [
  {
    path: '/dashboard',
    components: {
      default: DashboardMain,
      sidebar: DashboardSidebar,
      header: DashboardHeader
    }
  }
]
```

在模板中使用：

```vue
<template>
  <div class="dashboard-layout">
    <router-view name="header" class="header" />
    <router-view name="sidebar" class="sidebar" />
    <router-view class="main" /> <!-- default -->
  </div>
</template>
```

## 滚动行为

Vue Router 4 允许自定义页面切换时的滚动行为：

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果用户使用浏览器的前进/后退按钮
    if (savedPosition) {
      return savedPosition
    }
    
    // 如果有哈希锚点
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    
    // 否则滚动到页面顶部
    return { top: 0 }
  }
})
```

## 懒加载路由

通过动态导入实现路由懒加载，提升应用性能：

```javascript
const routes = [
  {
    path: '/user',
    component: () => import('./views/User.vue'), // 懒加载
    children: [
      {
        path: 'profile',
        component: () => import('./views/UserProfile.vue') // 懒加载
      },
      {
        path: 'posts',
        component: () => import('./views/UserPosts.vue') // 懒加载
      }
    ]
  }
]
```

可以使用 Webpack 或 Vite 的魔法注释为懒加载块命名：

```javascript
// Webpack
const UserProfile = () => import(/* webpackChunkName: "user-profile" */ './views/UserProfile.vue')

// Vite
const UserProfile = () => import(/* @vite-ignore */ './views/UserProfile.vue')
```

## 总结

Vue Router 4 带来了众多改进和新特性，尤其是与 Vue 3 组合式 API 的无缝集成，使得路由管理变得更加强大和灵活。主要亮点包括：

- 全面支持组合式 API（useRouter、useRoute 等）
- 更灵活的动态路由管理
- 改进的导航守卫系统
- 更好的 TypeScript 集成
- 增强的路由元信息

在构建 Vue 3 应用时，Vue Router 4 是处理路由需求的理想选择，它提供了构建复杂单页应用所需的所有工具。 
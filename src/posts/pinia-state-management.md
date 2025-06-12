---
title: Pinia: Vue 的下一代状态管理库
date: 2023-08-12
tags: ['Pinia', 'Vue', '状态管理', '前端开发']
description: Pinia 是 Vue 的官方状态管理库，旨在替代 Vuex。本文详细介绍了 Pinia 的核心概念、使用方法和最佳实践，帮助你构建更好的 Vue 应用。
---

# Pinia: Vue 的下一代状态管理库

Pinia 是 Vue 的官方状态管理库，由 Vue 核心团队成员 Eduardo San Martin Morote 创建，现已成为 Vue 官方推荐的状态管理解决方案。它采用了更简单的 API 设计，提供了更好的类型支持，以及更优雅的模块化设计。

[[toc]]

## Pinia 简介

> [!NOTE]
> Pinia (发音为 /piːnjʌ/，如英语中的"peenya") 这个名字源自西班牙语中的菠萝(piña)。

Pinia 最初是作为 Vuex 5 的概念验证而设计的，旨在探索 Vuex 的下一代版本会是什么样子。它已经实现了 Vuex 5 的大部分提案，现在作为 Vue 的官方状态管理库被推荐使用。

### Pinia 的优势

与 Vuex 相比，Pinia 有以下优势：

1. **更简单的 API**：没有 mutations，只有 state、actions 和 getters
2. **完整的 TypeScript 支持**：自动推断类型，无需额外配置
3. **模块化设计**：无需创建复杂的模块嵌套结构
4. **更小的体积**：只有约 1KB（压缩后）
5. **支持多个 Store**：可以创建多个独立的 Store，便于代码组织
6. **支持 Vue DevTools**：提供友好的调试体验
7. **支持服务端渲染 (SSR)**
8. **支持热模块替换 (HMR)**：开发过程中可以修改 Store 而不刷新页面

## 安装 Pinia

### 使用包管理器

```bash
# npm
npm install pinia

# yarn
yarn add pinia

# pnpm
pnpm add pinia
```

### 在 Vue 应用中设置 Pinia

```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## 创建和使用 Store

### 定义 Store

使用 `defineStore` 函数定义一个 Store：

```javascript
// stores/counter.js
import { defineStore } from 'pinia'

// 第一个参数是 store 的唯一 ID
export const useCounterStore = defineStore('counter', {
  // state 是 store 的数据（状态）
  state: () => ({
    count: 0,
    name: 'Counter',
  }),
  
  // getters 类似于计算属性
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用 this 访问 state 和其他 getters
    doubleCountPlusOne() {
      return this.doubleCount + 1
    },
  },
  
  // actions 包含可以改变状态的方法
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    async fetchFromAPI() {
      const response = await fetch('/api/counter')
      const data = await response.json()
      this.count = data.count
    },
  },
})
```

### 组合式 API 风格定义

Pinia 也支持使用组合式 API 风格定义 Store：

```javascript
// stores/counter.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // ref() 相当于 state 属性
  const count = ref(0)
  const name = ref('Counter')
  
  // computed() 相当于 getters
  const doubleCount = computed(() => count.value * 2)
  
  // 函数相当于 actions
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  async function fetchFromAPI() {
    const response = await fetch('/api/counter')
    const data = await response.json()
    count.value = data.count
  }
  
  // 返回需要暴露的状态和方法
  return { 
    count, 
    name, 
    doubleCount, 
    increment, 
    decrement, 
    fetchFromAPI 
  }
})
```

### 在组件中使用 Store

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

// 获取 store 实例
const counter = useCounterStore()

// 直接访问 state
console.log(counter.count)

// 访问 getters
console.log(counter.doubleCount)

// 调用 actions
function handleClick() {
  counter.increment()
}

// 更改状态
function updateName() {
  counter.name = 'New Name'
}
</script>

<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double Count: {{ counter.doubleCount }}</p>
    <button @click="handleClick">Increment</button>
    <button @click="counter.decrement">Decrement</button>
    <button @click="updateName">Update Name</button>
  </div>
</template>
```

## 解构 Store

当直接解构 Store 时，会失去响应性：

```js
// ❌ 这样会破坏响应性
const { count, name } = useCounterStore()
```

Pinia 提供了两种保持响应性的方法：

### 1. 使用 storeToRefs

```js
import { storeToRefs } from 'pinia'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// 使用 storeToRefs 解构（类似于 toRefs）
// 仅解构出状态和 getters
const { count, name, doubleCount } = storeToRefs(store)

// 方法（actions）可以正常解构
const { increment, decrement } = store
```

### 2. 使用计算属性

```js
import { computed } from 'vue'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// 使用计算属性创建响应式引用
const count = computed({
  get: () => store.count,
  set: (value) => store.count = value
})
```

## 修改 State

### 直接修改

```js
const store = useCounterStore()

// 直接修改状态
store.count++
store.name = 'New Name'
```

### 批量修改

使用 `$patch` 方法批量修改多个状态：

```js
// 方法 1：传入一个对象
store.$patch({
  count: store.count + 1,
  name: 'New Name',
})

// 方法 2：传入一个函数（更适合包含逻辑的修改）
store.$patch((state) => {
  state.count++
  state.name = 'New Name'
  
  // 可以包含条件逻辑
  if (state.count > 10) {
    state.count = 0
  }
})
```

### 替换整个 State

使用 `$state` 替换整个状态：

```js
// 完全替换 state
store.$state = {
  count: 100,
  name: 'Replaced State',
}
```

## 监听 State 变化

### 使用 watch

```js
import { watch } from 'vue'
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

// 监听整个 store
watch(
  store,
  (newState, oldState) => {
    console.log('Store changed:', newState, oldState)
  },
  { deep: true } // 深度监听
)

// 监听特定属性
watch(
  () => store.count,
  (newCount, oldCount) => {
    console.log(`Count changed from ${oldCount} to ${newCount}`)
  }
)
```

### 使用 $subscribe

Pinia 提供了 `$subscribe` 方法，类似于 Vuex 的 `subscribe`：

```js
// 订阅 state 变化
store.$subscribe((mutation, state) => {
  // mutation 包含一些有关变化的信息
  console.log('State changed:', mutation, state)
  
  // 可以在这里持久化 state
  localStorage.setItem('counter', JSON.stringify(state))
})

// 可以指定 detached: true 使订阅在组件卸载后继续生效
store.$subscribe((mutation, state) => {
  // ...
}, { detached: true })
```

## Store 之间的通信

Pinia 中的 Store 可以导入并使用其他 Store：

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  
  actions: {
    checkout() {
      const userStore = useUserStore()
      
      if (!userStore.isLoggedIn) {
        userStore.openLoginModal()
        return false
      }
      
      // 继续结账流程...
      return true
    },
  },
})
```

## 插件系统

Pinia 提供了一个强大的插件系统，可以扩展 Store 功能：

### 创建插件

```js
// plugins/persistencePlugin.js
import { toRaw } from 'vue'

export function persistencePlugin({ store }) {
  // 从 localStorage 恢复状态
  const savedState = localStorage.getItem(`pinia-${store.$id}`)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }
  
  // 监听变化并保存到 localStorage
  store.$subscribe((mutation, state) => {
    localStorage.setItem(`pinia-${store.$id}`, JSON.stringify(toRaw(state)))
  })
  
  // 可以为 store 添加新属性
  store.$persistTime = new Date()
  
  // 也可以添加新方法
  store.$resetToDefault = () => {
    // 重置逻辑
  }
}
```

### 使用插件

```js
// main.js
import { createPinia } from 'pinia'
import { persistencePlugin } from './plugins/persistencePlugin'

const pinia = createPinia()
pinia.use(persistencePlugin)

app.use(pinia)
```

## 最佳实践

### Store 结构组织

将 Store 分割成多个小型 Store，每个 Store 负责特定的功能域：

```
src/
└── stores/
    ├── index.js          # 导出所有 store
    ├── user.js           # 用户相关状态
    ├── cart.js           # 购物车相关状态
    ├── products.js       # 产品相关状态
    └── ui.js             # UI 相关状态（如主题、布局等）
```

### 数据获取模式

在 Store 中处理数据获取逻辑：

```js
// stores/products.js
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  
  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        this.products = await response.json()
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
})
```

### 利用组合式 API 优化逻辑组织

使用组合式 API 风格可以更好地组织复杂逻辑：

```js
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // 依赖注入 router
  const router = useRouter()
  
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  
  // getters
  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || 'guest')
  
  // actions
  async function login(credentials) {
    loading.value = true
    
    try {
      // 登录逻辑
      const data = await apiLogin(credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      
      // 导航到仪表盘
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  // 返回暴露的状态和方法
  return {
    user,
    token,
    loading,
    isLoggedIn,
    userRole,
    login,
    logout,
  }
})
```

## 对比 Vuex

Pinia 和 Vuex 的主要区别：

| 特性 | Pinia | Vuex 4 |
|------|-------|--------|
| **模块结构** | 扁平化的多 Store 设计 | 单一 Store + 嵌套模块 |
| **类型支持** | 内置的 TypeScript 支持 | 需要额外的类型定义 |
| **修改方法** | 直接修改 state 或使用 actions | 必须通过 mutations 修改 state |
| **开发体验** | 更简洁的 API，更少的样板代码 | 更多的样板代码 |
| **DevTools 支持** | 支持 | 支持 |
| **命名空间** | 默认扁平化，无需命名空间 | 需要手动启用模块命名空间 |
| **组合式 API 风格** | 支持 | 不支持 |

## 总结

Pinia 是 Vue 的现代状态管理库，它提供了更简单、更类型安全、更模块化的 API。作为 Vue 的官方推荐状态管理库，它与 Vue 3 无缝集成，特别是与组合式 API 一起使用时。

使用 Pinia 的优势包括：
- 更简洁的 API 设计
- 卓越的 TypeScript 支持
- 优雅的模块化结构
- 直观的状态修改方式
- 与 Vue DevTools 的集成
- 更好的性能

无论是小型应用还是大型复杂项目，Pinia 都是管理 Vue 应用状态的理想选择。 
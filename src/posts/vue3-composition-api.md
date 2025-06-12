---
title: 开始使用 Vue 3 和组合式 API
date: 2023-06-15
tags: ['Vue', 'JavaScript', '前端开发']
description: Vue 3 引入了组合式 API，它提供了一种更灵活的方式来组织组件逻辑，本文将详细介绍其使用方法和最佳实践。
---

# 开始使用 Vue 3 和组合式 API

[[toc]]

## 什么是组合式 API？

Vue 3 引入了组合式 API（Composition API），它提供了一种更灵活的方式来组织组件逻辑。相比于 Vue 2 的选项式 API，组合式 API 允许我们按照逻辑关注点组织代码，而不是按照选项类型。

> [!NOTE]
> 组合式 API 完全可选，但建议在复杂组件中使用，它可以让代码更易于理解和维护。

## 为什么要使用组合式 API？

Vue 2 的选项式 API 存在一些限制：

1. **代码复用困难** - 混入（mixins）机制容易导致命名冲突和数据来源不清晰
2. **代码组织分散** - 相关逻辑被分散到不同选项中，维护复杂组件时需要不断"跳转"
3. **TypeScript 支持有限** - 选项式 API 在类型推导方面存在一些限制

组合式 API 通过提供更灵活的代码组织方式解决了这些问题。

## 核心概念

### setup 函数

组合式 API 的入口是 `setup` 函数，它在组件实例创建之前执行：

```javascript
export default {
  setup() {
    // 这里编写组合式 API 代码
    // ...
    
    // 返回要暴露给模板的数据和方法
    return {
      // ...
    }
  }
}
```

### 响应式核心 API

#### ref

`ref` 用于创建任何类型的响应式数据：

```javascript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

// 修改值
count.value++
console.log(count.value) // 1
```

#### reactive

`reactive` 用于创建响应式对象：

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

// 直接修改
state.count++
state.message = 'World'
```

#### computed

`computed` 用于创建计算属性：

```javascript
import { ref, computed } from 'vue'

const count = ref(0)

// 创建计算属性
const doubleCount = computed(() => count.value * 2)

console.log(doubleCount.value) // 0
count.value++
console.log(doubleCount.value) // 2
```

#### watch 和 watchEffect

监听响应式数据变化：

```javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const message = ref('Hello')

// 监听单个数据源
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// 同时监听多个数据源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log(`Count: ${oldCount} -> ${newCount}, Message: ${oldMessage} -> ${newMessage}`)
})

// watchEffect 会自动追踪其内部使用的所有响应式数据
watchEffect(() => {
  console.log(`Count is ${count.value}, message is ${message.value}`)
})
```

### 生命周期钩子

组合式 API 提供了一组生命周期钩子函数：

```javascript
import { 
  onMounted, 
  onUpdated, 
  onUnmounted, 
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('Component mounted')
    })
    
    onUpdated(() => {
      console.log('Component updated')
    })
    
    onUnmounted(() => {
      console.log('Component unmounted')
    })
  }
}
```

## 组合式函数（Composables）

组合式 API 的一个重要优势是能够创建可复用的组合式函数（也称为"Composables"）：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  const doubleCount = computed(() => count.value * 2)
  
  return {
    count,
    increment,
    decrement,
    doubleCount
  }
}
```

在组件中使用：

```javascript
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, increment, decrement, doubleCount } = useCounter(10)
    
    // 返回给模板
    return {
      count,
      increment,
      decrement,
      doubleCount
    }
  }
}
```

## script setup 语法糖

Vue 3.2 引入了 `<script setup>` 语法糖，进一步简化了组合式 API 的使用：

```vue
<script setup>
import { ref, computed } from 'vue'
import { useCounter } from './useCounter'

// 组件状态
const message = ref('Hello Vue 3')

// 使用组合式函数
const { count, increment, decrement, doubleCount } = useCounter(10)

// 计算属性
const reversedMessage = computed(() => {
  return message.value.split('').reverse().join('')
})

// 方法
function updateMessage(newMessage) {
  message.value = newMessage
}

// 无需return，所有顶级变量和函数都会自动暴露给模板
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <p>Reversed: {{ reversedMessage }}</p>
    <button @click="updateMessage('Hello Composition API')">Update Message</button>
    
    <div>
      <p>Count: {{ count }}</p>
      <p>Double Count: {{ doubleCount }}</p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </div>
  </div>
</template>
```

## 最佳实践

### 何时使用 ref vs. reactive

- 使用 `ref` 处理基本类型值（字符串、数字、布尔值等）
- 对于对象，可以使用 `reactive` 或 `ref`，但保持一致性
- 从组合式函数返回时，倾向于使用 `ref`，因为它们可以被解构而不会失去响应性

### 避免过度解构

解构 `reactive` 对象会使其失去响应性：

```javascript
const state = reactive({ count: 0 })

// ❌ 错误，count 失去响应性
const { count } = state

// ✅ 正确，保持响应性
const count = computed(() => state.count)
```

### 保持组合式函数的纯粹性

组合式函数应该是可复用的，保持纯粹，并且具有明确的职责：

```javascript
// ✅ 好的组合式函数：单一职责，返回相关的状态和方法
function useSearch(initialQuery = '') {
  const searchQuery = ref(initialQuery)
  const results = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  async function performSearch() {
    isLoading.value = true
    error.value = null
    try {
      results.value = await fetchSearchResults(searchQuery.value)
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    searchQuery,
    results,
    isLoading,
    error,
    performSearch
  }
}
```

## 总结

Vue 3 的组合式 API 提供了一种更灵活、更强大的方式来组织组件逻辑。它解决了 Vue 2 中的代码复用和组织问题，并提供了更好的 TypeScript 支持。

虽然学习曲线可能比选项式 API 陡峭一些，但在处理复杂组件和创建可复用逻辑时，组合式 API 的优势是显著的。两种 API 风格可以共存，你可以根据具体场景选择最适合的方式。 
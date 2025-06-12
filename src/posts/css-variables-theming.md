---
title: CSS 变量在主题切换中的应用
date: 2023-10-08
tags: ['CSS', '主题', '前端开发']
description: CSS 变量（自定义属性）为 Web 开发提供了强大的主题定制能力。本文将探讨如何使用 CSS 变量实现暗黑模式和多主题切换，并分享最佳实践。
---

# CSS 变量在主题切换中的应用

CSS 变量（Custom Properties）自 CSS3 引入后，越来越多地被用于主题定制、组件库开发以及动态样式控制。本文将介绍 CSS 变量的基本语法、主题切换的实现思路以及性能和可维护性方面的最佳实践。

[[toc]]

## 什么是 CSS 变量？

CSS 变量是一种可以在整个文档中复用的自定义属性，其作用域遵循标准的 CSS 层叠规则。变量以 `--` 前缀声明，通过 `var()` 函数引用。

```css
/* 变量声明 */
:root {
  --color-primary: #1e90ff;
  --font-size-base: 16px;
}

/* 变量使用 */
.button {
  color: var(--color-primary);
  font-size: var(--font-size-base);
}
```

## 为什么使用 CSS 变量实现主题切换？

1. **运行时可变**：与预处理器变量（Sass/Less）不同，CSS 变量可在运行时修改。
2. **作用域继承**：可在不同层级覆盖，轻松实现局部主题。
3. **响应式系统**：配合媒体查询实现自动主题切换，如暗黑模式。
4. **浏览器支持良好**：现代浏览器已全面支持（IE11 需降级）。

## 基本主题切换实现

### 1. 定义主题变量

```css
/* 默认（亮色）主题 */
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-primary: #0066ff;
}

/* 暗黑主题 */
[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-text: #e5e5e5;
  --color-primary: #3399ff;
}
```

### 2. 切换主题

```javascript
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}
```

### 3. Vue 组件示例

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const isDark = ref(false)

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
})
</script>

<template>
  <button @click="isDark = !isDark">
    切换主题
  </button>
</template>
```

## 自动暗黑模式

利用媒体查询 `prefers-color-scheme` 可在用户系统设置变更时自动切换主题：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e5e5e5;
    --color-primary: #3399ff;
  }
}
```

## 高级技巧

### 动态更改主色调

```javascript
function setPrimaryColor(color) {
  document.documentElement.style.setProperty('--color-primary', color)
}
```

### 组合变量

```css
:root {
  --spacing-unit: 8px;
  --spacing-md: calc(var(--spacing-unit) * 2);
}
```

### HSL 颜色模式

使用 HSL 可轻松调整色相、饱和度、亮度：

```css
:root {
  --primary-h: 220;
  --primary-s: 90%;
  --primary-l: 56%;
  --color-primary: hsl(var(--primary-h) var(--primary-s) var(--primary-l));
}
```

## 性能与可维护性

1. **避免过度嵌套**：变量层级过深会影响可读性。
2. **使用命名空间**：如 `--btn-bg`、`--card-shadow` 提高语义性。
3. **批量更新变量**：使用 CSS `:root` 覆盖减少重排。
4. **降级处理**：对不支持 CSS 变量的浏览器使用后备颜色或 Sass 变量。

## 常见问题

### 1. 如何在 JavaScript 中获取变量值？

```javascript
const primary = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
console.log(primary.trim());
```

### 2. 变量修改后为何无效？

- 确认作用域层级正确
- 使用 `!important` 可能会导致覆盖失败
- 检查拼写是否正确

### 3. 是否可以与 TailwindCSS 结合？

Tailwind 支持 JIT 模式中使用 CSS 变量，可通过 `theme.extend.colors` 引入变量。

## 结语

CSS 变量为主题切换提供了简洁而高效的方案，配合 JavaScript 与框架级别的状态管理，可实现复杂的主题系统。掌握变量作用域、继承与动态更新技巧，将帮助你构建灵活且可维护的 UI 设计体系。 
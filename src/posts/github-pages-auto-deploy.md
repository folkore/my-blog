---
title: 使用 GitHub Actions 自动部署 Vue 项目到 GitHub Pages
date: 2024-03-21
tags: ['GitHub Actions', 'Vue.js', 'CI/CD', '自动部署']
description: 详细介绍如何使用 GitHub Actions 将 Vue.js 项目自动部署到 GitHub Pages，包括配置过程和常见问题解决方案。
---

# 使用 GitHub Actions 自动部署 Vue 项目到 GitHub Pages

在现代前端开发中，自动化部署是提高开发效率的重要环节。本文将详细介绍如何使用 GitHub Actions 将 Vue.js 项目自动部署到 GitHub Pages，让您的部署过程变得简单而可靠。

## 前置要求

- 一个基于 Vue.js 的项目（本文以 Vite + Vue 3 为例）
- GitHub 账号
- 基本的 Git 操作知识

## 配置步骤

### 1. 创建 GitHub Actions 工作流

首先，在项目根目录创建 `.github/workflows` 目录，然后创建 `gh-pages.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]          # 你的主分支名称

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
          run_install: false

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --no-frozen-lockfile

      - name: Build
        run: pnpm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2. 配置 Vite

为了确保项目在 GitHub Pages 上正确运行，需要调整 Vite 的配置。修改 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/your-repo-name/',  // 替换为你的仓库名
  // ... 其他配置
})
```

### 3. 配置路由

如果使用了 Vue Router，需要确保路由能够正确处理基础路径。修改路由配置：

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 你的路由配置
  ]
})
```

## 部署流程说明

1. **触发条件**：当你推送代码到主分支时，GitHub Actions 会自动触发部署流程。

2. **构建步骤**：
   - 检出代码
   - 设置 pnpm
   - 设置 Node.js 环境
   - 安装项目依赖
   - 构建项目
   - 上传构建产物

3. **部署步骤**：
   - 将构建产物部署到 GitHub Pages
   - 生成可访问的 URL

## 常见问题及解决方案

### 1. 404 错误

如果部署后访问页面出现 404 错误，通常是因为：

- **基础路径配置错误**：确保 `vite.config.js` 中的 `base` 配置与仓库名称一致
- **路由配置问题**：检查路由是否正确使用了 `import.meta.env.BASE_URL`

### 2. 资源加载失败

如果页面样式或脚本加载失败，可能是因为：

- 资源路径没有包含基础路径
- 使用了绝对路径而非相对路径

### 3. 构建失败

常见的构建失败原因包括：

- 依赖安装失败：检查包管理器配置
- 构建脚本错误：检查 `package.json` 中的构建命令
- 环境变量缺失：确保必要的环境变量已配置

## 最佳实践

1. **使用最新版本的 Actions**：
   - 保持 GitHub Actions 相关组件的版本更新
   - 使用稳定版本的依赖

2. **优化构建过程**：
   - 合理配置缓存
   - 使用合适的 Node.js 版本
   - 选择合适的包管理器

3. **安全性考虑**：
   - 正确配置权限
   - 保护敏感信息
   - 定期更新依赖

## 结论

使用 GitHub Actions 自动部署到 GitHub Pages 不仅能够简化部署流程，还能确保部署的一致性和可靠性。通过合理的配置和最佳实践，您可以建立一个高效的前端项目自动化部署流程。

## 参考资源

- [GitHub Actions 文档](https://docs.github.com/cn/actions)
- [Vite 部署指南](https://cn.vitejs.dev/guide/static-deploy.html)
- [Vue Router 文档](https://router.vuejs.org/zh/) 
# 个人博客项目

一个基于Vue3+Vite开发的个人博客网站，设计风格参考苹果官网，支持暗黑模式切换。

## 项目特点

- 🌓 支持亮色/暗黑模式切换
- 🍎 苹果风格的现代设计
- 📱 完全响应式，支持各种设备
- ⚡ 基于Vite构建，开发体验极佳
- 🧩 组件化架构，易于扩展

## 技术栈

- Vue 3 - 渐进式JavaScript框架
- Vite - 下一代前端构建工具
- Vue Router - 官方路由管理器
- Pinia - 状态管理
- Markdown-it - Markdown解析器
- Highlight.js - 代码高亮

## 快速开始

### 安装依赖

```bash
cd my-blog
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
my-blog/
├── public/           # 静态资源
│   ├── assets/       # 样式和图片
│   ├── components/   # 可复用组件
│   ├── composables/  # 组合式函数
│   ├── layouts/      # 布局组件
│   ├── posts/        # 博客文章内容
│   ├── router/       # 路由配置
│   ├── store/        # 状态管理
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── index.html        # HTML模板
├── package.json      # 项目依赖
└── vite.config.js    # Vite配置
```

## 功能

- 首页展示
- 文章列表
- 文章详情页面
- 关于页面
- 联系页面
- 暗黑模式切换
- 响应式布局

## 自定义配置

参见 [Vite配置参考](https://vitejs.dev/config/)。

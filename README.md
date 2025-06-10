# 个人博客项目

一个基于Vue3+Vite开发的个人博客网站，设计风格现代简约，支持多种主题模式和国际化，提供丰富的交互体验。

## 项目特点

- 🌓 支持亮色/暗黑/系统跟随三种主题模式
- 🌍 支持中英文国际化切换
- 🔍 文章搜索与标签筛选功能
- 💬 文章评论与互动系统
- 🔄 文章分享到社交媒体
- 📱 完全响应式，支持各种设备
- ✨ 精美动画和过渡效果
- 🖼️ 图片懒加载优化
- ⚡ 基于Vite构建，开发体验极佳
- 🧩 组件化架构，易于扩展

## 技术栈

- **前端框架**: Vue 3 (组合式API)
- **构建工具**: Vite 
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **国际化**: Vue I18n
- **Markdown渲染**: Markdown-it
- **代码高亮**: Highlight.js
- **CSS变量**: 主题切换和样式管理

## 功能展示

### 多主题模式

支持亮色、暗色和跟随系统三种主题模式，通过CSS变量实现无缝切换，并持久化保存用户偏好。

### 国际化支持

完整支持中文和英文两种语言，可实时切换，无需刷新页面。语言设置会被保存在本地存储中。

### 文章搜索与筛选

- 实时搜索文章标题和内容
- 按标签筛选文章
- 分页浏览文章列表

### 阅读体验优化

- 文章阅读进度条
- 返回顶部按钮
- 代码块语法高亮
- 响应式设计，适配各种设备

### 社交互动

- 文章评论系统
- 分享到Twitter、Facebook、LinkedIn、微博和微信
- 一键复制链接功能

### 性能优化

- 图片懒加载
- 路由组件异步加载
- 页面过渡动画
- 主题切换平滑过渡

## 快速开始

### 安装依赖

```bash
# 使用npm
npm install

# 或使用pnpm
pnpm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
my-blog/
├── public/           # 静态资源
│   └── placeholder.svg # 图片占位符
├── src/              # 源代码
│   ├── assets/       # 样式和图片
│   ├── components/   # 可复用组件
│   │   ├── BackToTop.vue        # 返回顶部组件
│   │   ├── CommentSection.vue   # 评论区组件
│   │   ├── LanguageSwitcher.vue # 语言切换组件
│   │   ├── PageTransition.vue   # 页面过渡组件
│   │   ├── ReadingProgress.vue  # 阅读进度条组件
│   │   ├── SearchBar.vue        # 搜索栏组件
│   │   ├── ShareButtons.vue     # 分享按钮组件
│   │   └── TagFilter.vue        # 标签筛选组件
│   ├── composables/  # 组合式函数
│   │   ├── useScrollToTop.js    # 返回顶部逻辑
│   │   └── useTheme.js          # 主题切换逻辑
│   ├── directives/   # 自定义指令
│   │   └── lazyLoad.js          # 图片懒加载指令
│   ├── i18n/         # 国际化
│   │   ├── locales/             # 语言文件
│   │   └── index.js             # 国际化配置
│   ├── layouts/      # 布局组件
│   ├── posts/        # 博客文章内容
│   ├── router/       # 路由配置
│   ├── store/        # 状态管理
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   │   ├── About.vue            # 关于页面
│   │   ├── Blog.vue             # 博客列表页面
│   │   ├── BlogPost.vue         # 博客文章页面
│   │   ├── Contact.vue          # 联系页面
│   │   ├── Home.vue             # 首页
│   │   ├── LanguageTest.vue     # 语言测试页面
│   │   └── NotFound.vue         # 404页面
│   ├── App.vue       # 根组件
│   ├── main.js       # 入口文件
│   └── style.css     # 全局样式
├── index.html        # HTML模板
├── package.json      # 项目依赖
└── vite.config.js    # Vite配置
```

## 主要功能

### 首页

- 现代化的Hero区域设计
- 最新文章展示
- 技术栈展示区域
- 动画效果增强用户体验

### 博客列表页

- 文章搜索功能
- 标签筛选系统
- 分页浏览
- 响应式卡片布局

### 文章详情页

- 阅读进度指示
- 文章分享功能
- 评论系统
- 相关文章推荐

### 全局功能

- 主题切换（亮色/暗色/系统跟随）
- 语言切换（中文/英文）
- 返回顶部按钮
- 页面过渡动画

## 自定义配置

参见 [Vite配置参考](https://vitejs.dev/config/)。

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

MIT License

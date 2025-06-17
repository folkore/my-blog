# 个人博客项目

一个基于Vue3+Vite开发的个人博客网站，设计风格现代简约，支持多种主题模式和国际化，提供丰富的交互体验。

## 项目特点

- 🌓 支持亮色/暗黑/系统跟随三种主题模式
- 🌍 支持中英文国际化切换
- 🔍 强大的全局搜索和文章筛选功能
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
- **数学公式渲染**: KaTeX
- **目录 / 锚点插件**: markdown-it-anchor、markdown-it-table-of-contents
- **CSS变量**: 主题切换和样式管理

## 环境要求

| 工具 | 版本建议 |
|------|---------|
| Node.js | ≥ 18 LTS |
| npm | ≥ 9 |
| pnpm（可选） | ≥ 8 |

推荐通过 [nvm](https://github.com/coreybutler/nvm-windows) (or nvm-windows) 管理 Node 版本，避免全局冲突。

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

### 常用脚本

```bash
# 清理并重新安装依赖
pnpm install --frozen-lockfile

# 查看依赖关系图
npx vite --force --debug
```

## 目录结构

```
my-blog/
├── public/           # 静态资源
├── src/              # 源代码
│   ├── assets/       # 样式和图片
│   ├── components/   # 可复用组件
│   ├── composables/  # 组合式函数
│   ├── directives/   # 自定义指令
│   ├── i18n/         # 国际化
│   ├── layouts/      # 布局组件
│   ├── posts/        # 博客文章内容
│   ├── router/       # 路由配置
│   ├── store/        # 状态管理
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   ├── main.js       # 入口文件
│   └── style.css     # 全局样式
├── index.html        # HTML模板
├── package.json      # 项目依赖
└── vite.config.js    # Vite配置
```

## 主要功能

- 多主题模式（亮色/暗色/系统跟随）
- 国际化支持（中英文切换）
- 全局搜索与文章筛选
- 文章评论与社交分享
- 响应式设计与动画过渡
- 图片懒加载与性能优化
- 代码高亮与数学公式渲染
- 阅读进度、返回顶部、目录生成等阅读体验优化

## 代码规范与自动化

本项目采用 ESLint（含 vue 插件）+ Prettier 统一代码风格，Husky + lint-staged 实现提交前自动检查与格式化。

### 常用命令

```bash
# 检查代码规范
pnpm lint
# 自动格式化
pnpm format
```

### 提交前自动检查

已集成 Husky 钩子，提交前会自动执行 lint-staged 检查与修复。

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

MIT License

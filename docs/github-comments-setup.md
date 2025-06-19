# GitHub 评论系统配置指南

本博客系统集成了基于 GitHub Issues 的评论系统，支持 Markdown 格式评论、GitHub 用户认证等功能。

## 功能特性

- ✅ **GitHub Issues 作为评论后端** - 免费、稳定、无需额外服务器
- ✅ **自动创建 Issues** - 为每篇文章自动创建对应的 Issue
- ✅ **Markdown 支持** - 支持完整的 Markdown 语法
- ✅ **GitHub 用户认证** - 使用 GitHub 账号登录评论
- ✅ **响应式设计** - 完美适配移动端和桌面端
- ✅ **降级支持** - 未配置时自动降级到本地评论系统
- ✅ **实时同步** - 评论与 GitHub Issues 实时同步

## 配置步骤

### 1. 创建 GitHub 仓库

首先需要一个 GitHub 仓库来存储评论（可以是博客源码仓库或专门的评论仓库）。

### 2. 获取 GitHub Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置 Token 名称，如 "Blog Comments"
4. 选择权限：
   - `repo` - 完整的仓库访问权限（用于创建和管理 Issues）
5. 点击 "Generate token"
6. **重要：复制并保存生成的 token，页面刷新后将无法再次查看**

### 3. 配置环境变量

复制 `.env.example` 文件为 `.env.local` 并填入配置：

```bash
# GitHub 仓库所有者（用户名或组织名）
VITE_GITHUB_OWNER=your-username

# GitHub 仓库名称
VITE_GITHUB_REPO=your-blog-repo

# GitHub Personal Access Token
VITE_GITHUB_TOKEN=your-github-token

# 博客域名（用于生成文章链接）
VITE_BLOG_DOMAIN=https://your-blog-domain.com
```

### 4. 配置示例

```bash
# 示例配置
VITE_GITHUB_OWNER=johndoe
VITE_GITHUB_REPO=my-blog-comments
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_BLOG_DOMAIN=https://myblog.com
```

## 工作原理

1. **Issue 创建**：当用户首次访问文章时，系统会自动在 GitHub 仓库中创建一个对应的 Issue
2. **评论同步**：用户通过博客界面提交的评论会自动同步到对应的 GitHub Issue
3. **数据获取**：页面加载时从 GitHub API 获取最新的评论数据
4. **用户认证**：使用 GitHub OAuth 进行用户身份验证

## 安全考虑

- **Token 安全**：Personal Access Token 具有仓库完整权限，请妥善保管
- **权限最小化**：建议使用专门的评论仓库，避免与重要代码仓库混合
- **环境变量**：确保 `.env.local` 文件不被提交到版本控制系统

## 故障排除

### 评论系统未启用

**问题**：页面显示本地评论系统而非 GitHub 评论系统

**解决方案**：
1. 检查环境变量 `VITE_GITHUB_OWNER` 和 `VITE_GITHUB_REPO` 是否正确配置
2. 确认 `.env.local` 文件位于项目根目录
3. 重启开发服务器

### 无法创建 Issue

**问题**：控制台显示 "GitHub token is required to create issues"

**解决方案**：
1. 确认 `VITE_GITHUB_TOKEN` 已正确配置
2. 检查 Token 是否具有 `repo` 权限
3. 验证 Token 是否已过期

### API 请求失败

**问题**：GitHub API 请求返回 403 或 404 错误

**解决方案**：
1. 检查仓库名称和所有者是否正确
2. 确认仓库是公开的或 Token 有访问权限
3. 检查 GitHub API 速率限制

## 高级配置

### 自定义 Issue 标签

可以在 `src/services/github-comments.js` 中修改 Issue 标签：

```javascript
labels: ['blog-comment', 'custom-label']
```

### 自定义评论样式

评论样式定义在 `src/components/CommentSection.vue` 中，可以根据需要自定义。

### 多用户OAuth登录（推荐）

现在支持完整的多用户OAuth登录功能！任何GitHub用户都可以登录并以自己的身份发表评论。

**快速启动**：
```bash
# Linux/macOS
./scripts/start-oauth-system.sh

# Windows
scripts\start-oauth-system.bat
```

**详细配置指南**：请参考 [多用户OAuth登录系统配置指南](./multi-user-oauth-setup.md)

## 注意事项

1. **GitHub API 限制**：未认证请求每小时限制 60 次，认证请求每小时限制 5000 次
2. **Issue 数量**：每个仓库最多可创建 65536 个 Issues
3. **评论排序**：评论按创建时间正序排列
4. **Markdown 渲染**：GitHub API 返回的 HTML 内容已经过安全处理

## 支持与反馈

如遇到问题或有改进建议，请在项目仓库中创建 Issue。

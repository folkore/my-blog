# GitHub OAuth 配置指南

本文档介绍如何配置GitHub OAuth应用以实现完整的用户登录功能。

## 🔧 当前状态

您的评论系统目前使用 **Personal Access Token** 模式，这已经足够支持完整的评论功能。

### 现有配置
- ✅ `VITE_GITHUB_OWNER`: 已配置 (folkore)
- ✅ `VITE_GITHUB_REPO`: 已配置 (blog-comments)
- ✅ `VITE_GITHUB_TOKEN`: 已配置
- ✅ `VITE_BLOG_DOMAIN`: 已配置
- ❌ `VITE_GITHUB_CLIENT_ID`: 未配置（仅多用户模式需要）

**✨ 当前配置已完全满足您的需求！**

## 🚀 两种使用模式

### 模式一：Personal Access Token（当前模式）
**优点**：
- 配置简单，无需额外设置
- 适合个人博客和开发环境
- 已经可以正常使用评论功能

**限制**：
- 所有评论都以token所有者身份发布
- 无法区分不同用户
- 点击"登录"按钮会直接获取token所有者信息

### 模式二：完整OAuth流程
**优点**：
- 支持多用户登录
- 每个用户以自己的身份发布评论
- 更好的用户体验

**需要额外配置**：
- 创建GitHub OAuth应用
- 配置回调URL
- 添加Client ID和Secret

## 📋 OAuth应用配置步骤

如果您想要完整的多用户登录功能，请按以下步骤配置：

### 1. 创建GitHub OAuth应用

1. 访问 [GitHub Developer Settings](https://github.com/settings/applications/new)
2. 填写应用信息：
   ```
   Application name: My Blog Comments
   Homepage URL: http://localhost:3001/my-blog
   Application description: 博客评论系统
   Authorization callback URL: http://localhost:3001/my-blog/auth/github/callback
   ```
3. 点击 "Register application"

### 2. 获取应用凭据

创建成功后，您会看到：
- **Client ID**: 类似 `Iv1.a1b2c3d4e5f6g7h8`
- **Client Secret**: 点击 "Generate a new client secret" 生成

### 3. 更新环境变量

在 `.env.local` 文件中添加：

```bash
# GitHub OAuth 应用配置
VITE_GITHUB_CLIENT_ID=your_client_id_here
VITE_GITHUB_CLIENT_SECRET=your_client_secret_here
```

### 4. 重启开发服务器

```bash
pnpm dev
```

## 🔒 安全注意事项

### Personal Access Token 模式
- ✅ Token 仅在服务端使用，相对安全
- ⚠️ 确保 `.env.local` 不被提交到版本控制

### OAuth 模式
- ✅ Client ID 可以公开
- ❌ Client Secret 必须保密
- ⚠️ 生产环境需要配置正确的回调URL

## 🛠️ 故障排除

### 问题：点击登录显示"未配置GitHub OAuth应用"

**解决方案**：
1. **简单方案**：继续使用当前的Personal Access Token模式
   - 点击"获取用户信息"按钮
   - 系统会自动获取token所有者信息
   
2. **完整方案**：按照上述步骤配置OAuth应用

### 问题：OAuth回调失败

**检查项**：
1. 回调URL是否正确配置
2. Client ID是否正确
3. 应用是否已激活

### 问题：权限不足

**解决方案**：
1. 确认Personal Access Token有 `repo` 权限
2. 确认OAuth应用有 `public_repo` 权限

## 📝 推荐配置

### 开发环境
- 使用 Personal Access Token 模式
- 简单快速，适合测试

### 生产环境
- 推荐使用 OAuth 模式
- 支持多用户，更好的用户体验
- 需要配置HTTPS和正确的域名

## 🔄 切换模式

### 从Token模式切换到OAuth模式
1. 按照上述步骤创建OAuth应用
2. 添加环境变量
3. 重启服务器
4. 用户需要重新登录

### 从OAuth模式切换到Token模式
1. 删除或注释 `VITE_GITHUB_CLIENT_ID`
2. 重启服务器
3. 系统自动降级到Token模式

## 💡 最佳实践

1. **开发阶段**：使用Personal Access Token，快速开始
2. **测试阶段**：配置OAuth应用，测试多用户功能
3. **生产部署**：使用OAuth + HTTPS，确保安全性
4. **备份方案**：保留Token配置作为降级选项

## 📞 获取帮助

如果遇到配置问题：
1. 检查控制台错误信息
2. 确认环境变量配置
3. 验证GitHub应用设置
4. 查看网络请求状态

---

**当前状态**：您的系统已经可以正常使用评论功能，OAuth配置是可选的增强功能。

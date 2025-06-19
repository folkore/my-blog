# Blog OAuth Server

这是博客评论系统的OAuth认证服务器，用于处理GitHub OAuth登录流程。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# GitHub OAuth 应用配置
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# 服务器配置
PORT=3002
FRONTEND_URL=http://localhost:3001

# CORS 配置
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

### 3. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3002` 启动。

## 📋 API 端点

### GET /health
健康检查端点

**响应:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "blog-oauth-server"
}
```

### GET /auth/github
获取GitHub OAuth授权URL

**响应:**
```json
{
  "authUrl": "https://github.com/login/oauth/authorize?...",
  "state": "random_state",
  "redirectUri": "http://localhost:3002/auth/github/callback"
}
```

### GET /auth/github/callback
处理GitHub OAuth回调（自动重定向到前端）

**参数:**
- `code`: GitHub授权码
- `state`: 状态验证码

**成功重定向:** `${FRONTEND_URL}?oauth_success=true&access_token=...&user_data=...`
**失败重定向:** `${FRONTEND_URL}?error=oauth_failed&message=...`

### POST /auth/verify
验证GitHub访问令牌

**请求体:**
```json
{
  "token": "github_access_token"
}
```

**响应:**
```json
{
  "valid": true,
  "user": {
    "id": 12345,
    "login": "username",
    "name": "User Name",
    "avatar": "https://avatars.githubusercontent.com/...",
    "email": "user@example.com"
  }
}
```

## 🔧 GitHub OAuth 应用配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/applications/new)
2. 创建新的OAuth应用：
   - **Application name**: Blog Comment System
   - **Homepage URL**: `http://localhost:3001`
   - **Authorization callback URL**: `http://localhost:3002/auth/github/callback`
3. 获取 Client ID 和 Client Secret
4. 更新 `.env` 文件

## 🛡️ 安全注意事项

- ✅ Client Secret 仅在服务器端使用
- ✅ 支持CORS配置限制访问来源
- ✅ 状态参数验证防止CSRF攻击
- ⚠️ 生产环境请使用HTTPS
- ⚠️ 定期轮换Client Secret

## 🚀 部署

### 使用PM2（推荐）

```bash
npm install -g pm2
pm2 start server.js --name "blog-oauth"
pm2 save
pm2 startup
```

### 使用Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

## 🔍 故障排除

### 问题：OAuth回调失败
- 检查GitHub应用的回调URL配置
- 确认Client ID和Secret正确
- 查看服务器日志获取详细错误信息

### 问题：CORS错误
- 检查 `ALLOWED_ORIGINS` 环境变量
- 确认前端URL在允许列表中

### 问题：Token验证失败
- 确认token格式正确
- 检查GitHub API访问权限
- 验证token是否过期

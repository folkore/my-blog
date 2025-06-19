import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件配置
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  credentials: true
}));

// GitHub OAuth 配置
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// 验证必要的环境变量
if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.error('❌ 缺少必要的环境变量: GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET');
  process.exit(1);
}

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'blog-oauth-server'
  });
});

// OAuth 授权端点 - 生成授权URL
app.get('/auth/github', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  const scope = 'public_repo';
  const redirectUri = `${req.protocol}://${req.get('host')}/auth/github/callback`;
  
  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${scope}&` +
    `state=${state}`;
  
  // 返回授权URL和state，让前端处理重定向
  res.json({
    authUrl,
    state,
    redirectUri
  });
});

// OAuth 回调端点 - 处理授权码交换
app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.redirect(`${FRONTEND_URL}?error=no_code`);
  }
  
  try {
    // 交换授权码获取访问令牌
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const { access_token, token_type, scope } = tokenResponse.data;
    
    if (!access_token) {
      throw new Error('Failed to get access token');
    }
    
    // 获取用户信息
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const userData = userResponse.data;
    
    // 重定向回前端，携带用户信息和token
    const redirectUrl = new URL(FRONTEND_URL);
    redirectUrl.searchParams.set('oauth_success', 'true');
    redirectUrl.searchParams.set('access_token', access_token);
    redirectUrl.searchParams.set('user_data', JSON.stringify({
      id: userData.id,
      login: userData.login,
      name: userData.name,
      avatar: userData.avatar_url,
      email: userData.email
    }));
    
    res.redirect(redirectUrl.toString());
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${FRONTEND_URL}?error=oauth_failed&message=${encodeURIComponent(error.message)}`);
  }
});

// 验证token端点
app.post('/auth/verify', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }
  
  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const userData = response.data;
    
    res.json({
      valid: true,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar: userData.avatar_url,
        email: userData.email
      }
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 OAuth服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 前端URL: ${FRONTEND_URL}`);
  console.log(`🔑 GitHub Client ID: ${GITHUB_CLIENT_ID}`);
  console.log(`✅ 服务器启动成功！`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

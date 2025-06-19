#!/bin/bash

# 多用户OAuth评论系统启动脚本
# 使用方法: ./scripts/start-oauth-system.sh

echo "🚀 启动多用户OAuth评论系统..."

# 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装Node.js"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js版本过低，需要16+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 检查OAuth服务器配置
if [ ! -f "server/.env" ]; then
    echo "⚠️  未找到OAuth服务器配置文件"
    echo "📝 正在创建配置文件..."
    
    if [ ! -f "server/.env.example" ]; then
        echo "❌ 未找到server/.env.example文件"
        exit 1
    fi
    
    cp server/.env.example server/.env
    echo "✅ 已创建server/.env配置文件"
    echo "🔧 请编辑server/.env文件，填入您的GitHub OAuth配置"
    echo ""
    echo "需要配置的项目："
    echo "  - GITHUB_CLIENT_ID: GitHub OAuth应用的Client ID"
    echo "  - GITHUB_CLIENT_SECRET: GitHub OAuth应用的Client Secret"
    echo ""
    echo "配置完成后，请重新运行此脚本"
    exit 1
fi

# 检查前端配置
if [ ! -f ".env.local" ]; then
    echo "⚠️  未找到前端配置文件"
    echo "📝 正在创建配置文件..."
    
    if [ ! -f ".env.example" ]; then
        echo "❌ 未找到.env.example文件"
        exit 1
    fi
    
    cp .env.example .env.local
    echo "✅ 已创建.env.local配置文件"
    echo "🔧 请编辑.env.local文件，填入您的配置"
    echo ""
    echo "需要配置的项目："
    echo "  - VITE_GITHUB_OWNER: GitHub用户名或组织名"
    echo "  - VITE_GITHUB_REPO: 仓库名称"
    echo "  - VITE_GITHUB_CLIENT_ID: GitHub OAuth应用的Client ID"
    echo "  - VITE_OAUTH_SERVER_URL: OAuth服务器地址（默认: http://localhost:3002）"
    echo ""
    echo "配置完成后，请重新运行此脚本"
    exit 1
fi

# 安装OAuth服务器依赖
echo "📦 检查OAuth服务器依赖..."
if [ ! -d "server/node_modules" ]; then
    echo "📦 安装OAuth服务器依赖..."
    cd server
    npm install
    cd ..
    echo "✅ OAuth服务器依赖安装完成"
else
    echo "✅ OAuth服务器依赖已存在"
fi

# 安装前端依赖
echo "📦 检查前端依赖..."
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    pnpm install
    echo "✅ 前端依赖安装完成"
else
    echo "✅ 前端依赖已存在"
fi

# 启动服务
echo ""
echo "🚀 启动服务..."

# 检查端口是否被占用
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3002已被占用，正在尝试停止现有进程..."
    pkill -f "node.*server.js" || true
    sleep 2
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口3001已被占用，正在尝试停止现有进程..."
    pkill -f "vite.*dev" || true
    sleep 2
fi

# 启动OAuth服务器（后台运行）
echo "🔧 启动OAuth服务器..."
cd server
nohup npm start > ../oauth-server.log 2>&1 &
OAUTH_PID=$!
cd ..

# 等待OAuth服务器启动
echo "⏳ 等待OAuth服务器启动..."
sleep 3

# 检查OAuth服务器是否启动成功
if ! curl -s http://localhost:3002/health > /dev/null; then
    echo "❌ OAuth服务器启动失败，请检查日志: oauth-server.log"
    kill $OAUTH_PID 2>/dev/null || true
    exit 1
fi

echo "✅ OAuth服务器启动成功 (PID: $OAUTH_PID)"

# 启动前端开发服务器
echo "🎨 启动前端开发服务器..."
pnpm dev &
FRONTEND_PID=$!

echo ""
echo "🎉 多用户OAuth评论系统启动成功！"
echo ""
echo "📊 服务状态："
echo "  - OAuth服务器: http://localhost:3002 (PID: $OAUTH_PID)"
echo "  - 前端服务器: http://localhost:3001 (PID: $FRONTEND_PID)"
echo ""
echo "📝 日志文件："
echo "  - OAuth服务器日志: oauth-server.log"
echo ""
echo "🛑 停止服务："
echo "  - 按 Ctrl+C 停止前端服务器"
echo "  - 运行 'kill $OAUTH_PID' 停止OAuth服务器"
echo ""
echo "🔗 快速链接："
echo "  - 博客首页: http://localhost:3001"
echo "  - OAuth健康检查: http://localhost:3002/health"
echo ""

# 等待前端服务器启动
echo "⏳ 等待前端服务器启动..."
sleep 5

# 尝试打开浏览器
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3001
elif command -v open &> /dev/null; then
    open http://localhost:3001
fi

# 等待用户中断
wait $FRONTEND_PID

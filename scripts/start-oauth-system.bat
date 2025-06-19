@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 启动多用户OAuth评论系统...

REM 检查是否在项目根目录
if not exist "package.json" (
    echo ❌ 请在项目根目录运行此脚本
    pause
    exit /b 1
)

REM 检查Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node -v') do set NODE_MAJOR=%%a
set NODE_MAJOR=%NODE_MAJOR:v=%
if %NODE_MAJOR% lss 16 (
    echo ❌ Node.js版本过低，需要16+，当前版本: 
    node -v
    pause
    exit /b 1
)

echo ✅ Node.js版本: 
node -v

REM 检查OAuth服务器配置
if not exist "server\.env" (
    echo ⚠️  未找到OAuth服务器配置文件
    echo 📝 正在创建配置文件...
    
    if not exist "server\.env.example" (
        echo ❌ 未找到server\.env.example文件
        pause
        exit /b 1
    )
    
    copy "server\.env.example" "server\.env" >nul
    echo ✅ 已创建server\.env配置文件
    echo 🔧 请编辑server\.env文件，填入您的GitHub OAuth配置
    echo.
    echo 需要配置的项目：
    echo   - GITHUB_CLIENT_ID: GitHub OAuth应用的Client ID
    echo   - GITHUB_CLIENT_SECRET: GitHub OAuth应用的Client Secret
    echo.
    echo 配置完成后，请重新运行此脚本
    pause
    exit /b 1
)

REM 检查前端配置
if not exist ".env.local" (
    echo ⚠️  未找到前端配置文件
    echo 📝 正在创建配置文件...
    
    if not exist ".env.example" (
        echo ❌ 未找到.env.example文件
        pause
        exit /b 1
    )
    
    copy ".env.example" ".env.local" >nul
    echo ✅ 已创建.env.local配置文件
    echo 🔧 请编辑.env.local文件，填入您的配置
    echo.
    echo 需要配置的项目：
    echo   - VITE_GITHUB_OWNER: GitHub用户名或组织名
    echo   - VITE_GITHUB_REPO: 仓库名称
    echo   - VITE_GITHUB_CLIENT_ID: GitHub OAuth应用的Client ID
    echo   - VITE_OAUTH_SERVER_URL: OAuth服务器地址（默认: http://localhost:3002）
    echo.
    echo 配置完成后，请重新运行此脚本
    pause
    exit /b 1
)

REM 安装OAuth服务器依赖
echo 📦 检查OAuth服务器依赖...
if not exist "server\node_modules" (
    echo 📦 安装OAuth服务器依赖...
    cd server
    call npm install
    cd ..
    echo ✅ OAuth服务器依赖安装完成
) else (
    echo ✅ OAuth服务器依赖已存在
)

REM 安装前端依赖
echo 📦 检查前端依赖...
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call pnpm install
    echo ✅ 前端依赖安装完成
) else (
    echo ✅ 前端依赖已存在
)

REM 启动服务
echo.
echo 🚀 启动服务...

REM 检查并停止现有进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo ⚠️  端口3002已被占用，正在停止进程...
    taskkill /pid %%a /f >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo ⚠️  端口3001已被占用，正在停止进程...
    taskkill /pid %%a /f >nul 2>&1
)

REM 启动OAuth服务器
echo 🔧 启动OAuth服务器...
cd server
start /b cmd /c "npm start > ..\oauth-server.log 2>&1"
cd ..

REM 等待OAuth服务器启动
echo ⏳ 等待OAuth服务器启动...
timeout /t 3 /nobreak >nul

REM 检查OAuth服务器是否启动成功
curl -s http://localhost:3002/health >nul 2>&1
if errorlevel 1 (
    echo ❌ OAuth服务器启动失败，请检查日志: oauth-server.log
    pause
    exit /b 1
)

echo ✅ OAuth服务器启动成功

REM 启动前端开发服务器
echo 🎨 启动前端开发服务器...
start /b cmd /c "pnpm dev"

echo.
echo 🎉 多用户OAuth评论系统启动成功！
echo.
echo 📊 服务状态：
echo   - OAuth服务器: http://localhost:3002
echo   - 前端服务器: http://localhost:3001
echo.
echo 📝 日志文件：
echo   - OAuth服务器日志: oauth-server.log
echo.
echo 🔗 快速链接：
echo   - 博客首页: http://localhost:3001
echo   - OAuth健康检查: http://localhost:3002/health
echo.

REM 等待前端服务器启动
echo ⏳ 等待前端服务器启动...
timeout /t 5 /nobreak >nul

REM 打开浏览器
start http://localhost:3001

echo 🛑 按任意键停止所有服务...
pause >nul

REM 停止服务
echo 🛑 正在停止服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do taskkill /pid %%a /f >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /pid %%a /f >nul 2>&1

echo ✅ 服务已停止
pause

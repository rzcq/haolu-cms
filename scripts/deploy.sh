#!/bin/bash
# Haolu CMS 部署脚本
# 用法: bash scripts/deploy.sh

set -e

echo "=== Haolu CMS 部署 ==="

# 1. 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，从 .env.example 复制..."
    cp .env.example .env
    echo "请编辑 .env 填写实际配置后重新运行此脚本"
    exit 1
fi

# 2. 同步源码到 WSL（仅 Windows 下执行）
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "📁 同步源码到 WSL..."
    WSL_DISTRO="Ubuntu"
    WSL_PATH="~/haolu-cms"
    
    wsl -d $WSL_DISTRO -- mkdir -p $WSL_PATH/server
    wsl -d $WSL_DISTRO -- mkdir -p $WSL_PATH/admin
    wsl -d $WSL_DISTRO -- cp -r /mnt/f/workspace/2026/yongjiu/haolu-cms/server/* $WSL_PATH/server/
    wsl -d $WSL_DISTRO -- cp -r /mnt/f/workspace/2026/yongjiu/haolu-cms/admin/* $WSL_PATH/admin/
    wsl -d $WSL_DISTRO -- cp /mnt/f/workspace/2026/yongjiu/haolu-cms/.env $WSL_PATH/
    wsl -d $WSL_DISTRO -- cp /mnt/f/workspace/2026/yongjiu/haolu-cms/docker-compose.yml $WSL_PATH/
    
    echo "✅ 源码同步完成"
fi

# 3. 构建 Docker 镜像
echo "🔨 构建 Docker 镜像..."
export DOCKER_BUILDKIT=0
docker compose build

# 4. 启动容器
echo "🚀 启动容器..."
docker compose up -d

# 5. 等待 MySQL 就绪
echo "⏳ 等待 MySQL 就绪..."
sleep 10

# 6. 显示状态
echo "📊 容器状态:"
docker compose ps

echo ""
echo "✅ 部署完成！"
echo "   前台: http://localhost:3000"
echo "   后台: http://localhost:3000/admin"
echo "   MySQL: localhost:3307"

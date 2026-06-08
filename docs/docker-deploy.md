# Docker 部署指南

## 前置条件

- Docker + Docker Compose
- WSL Ubuntu（Windows 环境）

## 构建与部署

```bash
# 1. 进入项目目录
cd haolu-cms

# 2. 复制环境变量
cp .env.example .env
# 编辑 .env 填写实际配置

# 3. 构建（必须禁用 BuildKit）
DOCKER_BUILDKIT=0 docker compose build

# 4. 启动
docker compose up -d

# 5. 查看日志
docker compose logs -f app
```

## ⚠️ 已知问题

### BuildKit 与 pnpm 冲突

pnpm 的符号链接在 Docker BuildKit overlay 文件系统下会报错：
```
ERROR: cannot copy to non-directory: .../node_modules/@element-plus/icons-vue
```

**解决方案**：每次构建前执行：
```bash
export DOCKER_BUILDKIT=0
```

或在 `~/.bashrc` 中永久禁用。

### 首次构建时间

- 全量构建：8-10 分钟
- 增量构建（依赖已缓存）：3-5 分钟

## 容器说明

| 容器 | 端口 | 说明 |
|---|---|---|
| haolu-app | 3000 | Nuxt 应用 |
| haolu-mysql | 3307→3306 | MySQL 数据库 |
| haolu-redis | 6379 | Redis 缓存 |
| haolu-nginx | 80, 443 | 反向代理 |

## 数据库初始化

```bash
# 从 SQL 文件导入
docker exec -i haolu-mysql mysql -u node_forge_cms -p node_forge_cms < node_forge_cms.sql
```

## 常用命令

```bash
# 重启应用
docker compose restart app

# 查看应用日志
docker compose logs -f app

# 进入容器
docker exec -it haolu-app sh

# 清理构建缓存
docker builder prune -f
```

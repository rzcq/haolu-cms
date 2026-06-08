# Haolu CMS

浩禄机械内容管理系统，基于 Nuxt + Vue + MySQL 的多语言企业 CMS，面向重型机械外贸行业。

## 项目结构

```
haolu-cms/
├── server/              # Nuxt 服务端（SSR + API）
│   ├── app/             # 前台页面、组件、模板
│   ├── server/          # API、服务、数据库 Schema
│   ├── public/          # 静态资源
│   ├── shared/          # 前后端共享类型
│   └── types/           # TypeScript 类型定义
├── admin/               # Vue + Element Plus 管理后台
│   └── src/             # 源码（路由、视图、组件、API）
├── docs/                # 项目文档
├── scripts/             # 部署/运维脚本
├── docker-compose.yml   # Docker 部署配置
└── .env.example         # 环境变量模板
```

## 快速开始

### 环境要求

- Node.js 20+
- pnpm
- MySQL 8.0
- Redis 7+

### 本地开发

```bash
# 1. 复制环境变量
cp .env.example server/.env

# 2. 安装依赖
cd server && pnpm install
cd ../admin && pnpm install

# 3. 启动服务端
cd server && pnpm dev

# 4. 启动管理后台
cd admin && pnpm dev
```

### Docker 部署

```bash
# 构建并启动
DOCKER_BUILDKIT=0 docker compose build
docker compose up -d
```

> ⚠️ 必须使用 `DOCKER_BUILDKIT=0`，否则 pnpm 符号链接会导致构建失败。

## 技术栈

| 层 | 技术 |
|---|---|
| 前台 | Nuxt 3 + Vue 3 + UnoCSS |
| 管理后台 | Vue 3 + Element Plus + Vite |
| 后端 | Nuxt Server (Nitro) + Drizzle ORM |
| 数据库 | MySQL 8.0 + Redis 7 |
| 部署 | Docker + Nginx |

## 核心功能

- **多语言**：中英文（数据库驱动，支持动态翻译）
- **产品管理**：分类 + 参数模板 + 结构化参数
- **SEO/GEO**：JSON-LD 结构化数据、Sitemap、FAQ Schema
- **AI 扩展**：多 AI 服务商配置（智谱/豆包/DeepSeek/Agnes）
- **管理后台**：Vue + Element Plus，完整 CRUD + 数据字典

## 环境变量

复制 `.env.example` 到 `server/.env` 并填写实际值：

| 变量 | 说明 |
|---|---|
| `DATABASE_HOST` | MySQL 地址 |
| `DATABASE_USERNAME` | MySQL 用户名 |
| `DATABASE_PASSWORD` | MySQL 密码 |
| `DATABASE_DB` | 数据库名 |
| `JWT_SECRET` | JWT 签名密钥 |
| `REDIS_HOST` | Redis 地址 |
| `SERVER_HOST` | 站点公网地址 |
| `IMG_HOST` | 图片公网地址 |

## 部署架构

```
                    ┌─────────────┐
                    │   Nginx     │ ← 80/443
                    │  (SSL+代理)  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
        │  Nuxt App │ │ Admin │ │   MySQL   │
        │  :3000    │ │ 静态  │ │   :3306   │
        └───────────┘ └───────┘ └───────────┘
```

## 相关文档

- [Docker 部署指南](docs/docker-deploy.md)
- [API 文档](docs/api.md)
- [内容录入规范](docs/content-guide.md)

## 致谢

本项目基于 [NodeForgeCMS](https://github.com/yinMrsir/node-forge-cms) 二次开发，原项目采用 [MIT 许可证](https://github.com/yinMrsir/node-forge-cms/blob/main/LICENSE)。

Copyright (c) 2026 前端老鹰

## 致谢

本项目基于 [NodeForgeCMS](https://github.com/yinMrsir/node-forge-cms) 二次开发，原项目采用 [MIT 许可证](https://github.com/yinMrsir/node-forge-cms/blob/main/LICENSE)。

Copyright (c) 2026 前端老鹰

## License

Private — 河南浩禄机械设备有限公司

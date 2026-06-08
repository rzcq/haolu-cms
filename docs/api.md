# API 文档

## 公开 API（无需鉴权）

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/public/i18n/locale/{locale}` | 获取翻译数据 |
| GET | `/api/public/cms/geo.get` | 获取 GEO 结构化数据 |

## 管理 API（需 JWT 鉴权）

### 产品管理

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/cms/product/list` | 产品列表（分页） |
| POST | `/api/admin/cms/product/add` | 新增产品 |
| PUT | `/api/admin/cms/product/update` | 更新产品 |
| DELETE | `/api/admin/cms/product/delete` | 删除产品 |

### 分类管理

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/cms/category/list` | 分类列表 |
| GET | `/api/admin/cms/category/param-template` | 获取参数模板 |
| GET | `/api/admin/cms/category/param-templates` | 快捷模板列表 |

### AI 相关

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/admin/ai/translate` | AI 翻译 |
| POST | `/api/admin/ai/search` | AI 搜索 |
| POST | `/api/admin/ai/expand` | AI 内容展开（预留） |

### 系统管理

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/admin/auth/login` | 登录 |
| GET | `/api/admin/system/dict/list` | 数据字典 |
| GET | `/api/admin/system/config/list` | 系统配置 |

## 认证方式

登录后获取 JWT Token，后续请求在 Header 中携带：
```
Authorization: Bearer <token>
```

## 分页参数

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| pageNum | number | 1 | 页码 |
| limit | number | 10 | 每页条数 |

## 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

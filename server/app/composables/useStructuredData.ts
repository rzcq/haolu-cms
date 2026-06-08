/**
 * GEO 结构化数据 Composable
 *
 * 在页面组件中调用此 composable 来注入 Schema.org JSON-LD。
 * 用法：
 *   useStructuredData(buildOrganizationSchema(companyInfo))
 *   useStructuredData(buildProductSchema({ name, description, ... }))
 */

const structuredDataStore: Record<string, any[]> = {};

/**
 * 添加结构化数据到当前页面的 JSON-LD 注入队列
 * 全局 + 每页统一注入到 <head>
 */
export function useStructuredData(schema: Record<string, any> | Record<string, any>[]) {
  if (import.meta.server) {
    const schemas = Array.isArray(schema) ? schema : [schema];

    // 使用 useHead 在服务端注入 JSON-LD
    for (const s of schemas) {
      useHead({
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(s, null, 0)
          }
        ]
      });
    }
  }

  return {
    addSchema: (s: Record<string, any>) => {
      // 客户端可动态添加（适用于 SPA 导航场景）
    }
  };
}

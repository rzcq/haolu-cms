import { JsonConfigServices } from '~~/server/services/admin/system/jsonConfig/json.config.services';

/**
 * 获取 GEO 结构化数据所需的公司信息
 * 公开接口，前端用 useFetch 调用
 */
export default defineEventHandler(async () => {
  const jsonConfigServices = new JsonConfigServices();

  const [companyInfo, companyFaq] = await Promise.all([
    jsonConfigServices.findByKey('geo_company_info').catch(() => null),
    jsonConfigServices.findByKey('geo_company_faq').catch(() => null)
  ]);

  return {
    company: companyInfo?.configValue || null,
    faq: companyFaq?.configValue || []
  };
});

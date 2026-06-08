import { JsonConfigServices } from '~~/server/services/admin/system/jsonConfig/json.config.services';

/**
 * 获取预设的产品参数模板列表
 * 公开接口，管理后台分类编辑页调用
 */
export default defineEventHandler(async () => {
  const jsonConfigServices = new JsonConfigServices();
  const data = await jsonConfigServices.findByKey('product_param_templates').catch(() => null);

  if (!data?.configValue) {
    return createApiResponse({});
  }

  return createApiResponse(data.configValue);
});

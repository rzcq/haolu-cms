import { CategoryServices } from '~~/server/services/cms/category.services';
import { db } from '~~/server/utils/db';
import { categoryTable } from '~~/server/db/schema/cms/category';
import { eq, and } from 'drizzle-orm';

/**
 * 获取指定分类的参数模板（含继承逻辑）
 * 供管理后台产品表单调用
 */
export default defineEventHandler(async event => {
  try {
    const query = getQuery(event);
    const categoryId = query.categoryId ? Number(query.categoryId) : null;

    if (!categoryId) {
      throw createError({ statusCode: 400, message: '缺少 categoryId 参数' });
    }

    const categoryServices = new CategoryServices();
    const category = await categoryServices.findById(categoryId);
    if (!category) {
      throw createError({ statusCode: 404, message: '分类不存在' });
    }

    const paramTemplate = await categoryServices.getParamTemplate(categoryId);
    const topCategory = category.paramTemplate && category.paramTemplate.length > 0 ? category : null;

    // 判断是否为产品中心下的顶级分类（父级为 products 类型的根分类）
    const [productRoot] = await db
      .select()
      .from(categoryTable)
      .where(and(eq(categoryTable.templateType, 'products'), eq(categoryTable.parentCategoryId, 0)))
      .limit(1);
    console.log('[DEBUG param-template] db query result:', JSON.stringify({ categoryId, parentCategoryId: category.parentCategoryId, productRoot: productRoot ? { id: productRoot.id, name: productRoot.categoryName } : null }));
    const isTopLevel = productRoot
      ? category.parentCategoryId === productRoot.categoryId
      : category.parentCategoryId === 0 || category.parentCategoryId === null;

    return createApiResponse({
      categoryId,
      categoryName: category.categoryName,
      paramTemplate,
      isTopLevel,
      inheritedFrom: topCategory
        ? null
        : paramTemplate.length > 0
          ? { categoryId: null, categoryName: '(继承自父级分类)' }
          : null
    });
  } catch (error: any) {
    console.error('获取参数模板错误:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取参数模板失败'
    });
  }
});

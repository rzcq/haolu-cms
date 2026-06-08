import { AITranslateService } from '~~/server/services/ai/ai.service';
import { CategoryServices } from '~~/server/services/cms/category.services';
import { buildExpandPrompt } from '~~/server/services/ai/prompts/machinery-expand';
import type { ParamField } from '~~/server/db/schema/cms/category';

interface ExpandOutput {
  productName: { zh: string; en: string };
  summary: { zh: string; en: string };
  description: { zh: string; en: string };
  keywords: { zh: string; en: string };
  specifications: Record<string, string>;
}

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event);
    const { productName, rawSpecs = '', categoryId } = body;

    // 参数校验
    if (!productName || typeof productName !== 'string' || productName.trim() === '') {
      throw createError({ statusCode: 400, message: '请输入产品名称' });
    }

    if (!categoryId) {
      throw createError({ statusCode: 400, message: '请选择产品分类' });
    }

    const trimmedName = productName.trim();
    const trimmedSpecs = (typeof rawSpecs === 'string' ? rawSpecs : '').trim();

    // 获取分类信息及参数模板
    const categoryServices = new CategoryServices();
    const category = await categoryServices.findById(Number(categoryId));
    if (!category) {
      throw createError({ statusCode: 400, message: '所选分类不存在' });
    }

    const paramTemplate: ParamField[] = await categoryServices.getParamTemplate(Number(categoryId));
    const categoryName = category.categoryName?.zh || '';

    // 如果没有参数模板，只生成文案（不含 specifications）
    const noTemplate = paramTemplate.length === 0;

    // 构建 prompt
    const { systemPrompt, userPrompt } = buildExpandPrompt(
      trimmedName,
      trimmedSpecs,
      paramTemplate,
      categoryName
    );

    // 调用 AI
    const aiService = new AITranslateService();
    const rawResult = await aiService.structuredOutput<ExpandOutput>(
      systemPrompt,
      userPrompt,
      { temperature: 0.3, maxTokens: 4000 }
    );

    // 校验并补全输出
    const result: ExpandOutput = {
      productName: {
        zh: rawResult.productName?.zh || trimmedName,
        en: rawResult.productName?.en || trimmedName
      },
      summary: {
        zh: rawResult.summary?.zh || '',
        en: rawResult.summary?.en || ''
      },
      description: {
        zh: rawResult.description?.zh || '',
        en: rawResult.description?.en || ''
      },
      keywords: {
        zh: rawResult.keywords?.zh || '',
        en: rawResult.keywords?.en || ''
      },
      specifications: noTemplate
        ? {}
        : paramTemplate.reduce(
            (acc, param) => {
              acc[param.key] = rawResult.specifications?.[param.key] || '';
              return acc;
            },
            {} as Record<string, string>
          )
    };

    return createApiResponse({
      ...result,
      _meta: {
        categoryName,
        paramCount: paramTemplate.length,
        noTemplate
      }
    });
  } catch (error: any) {
    console.error('AI 产品展开错误:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'AI 展开失败，请稍后重试'
    });
  }
});

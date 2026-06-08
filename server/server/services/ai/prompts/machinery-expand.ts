import type { ParamField } from '~~/server/db/schema/cms/category';

/**
 * 机械产品文案展开 Prompt 模板
 *
 * 输入：产品名称 + 自然语言规格 + 分类参数模板
 * 输出：中英文全套产品内容
 */
export function buildExpandPrompt(
  productName: string,
  rawSpecs: string,
  paramTemplate: ParamField[],
  categoryName: string
): { systemPrompt: string; userPrompt: string } {
  const paramList = paramTemplate
    .sort((a, b) => a.sort - b.sort)
    .map(p => `- ${p.label.zh} (${p.unit || '无单位'})`)
    .join('\n');

  const paramKeys = paramTemplate.map(p => p.key).join(', ');

  const systemPrompt = `你是一个重型机械行业的产品文案专家。你的客户是河南浩禄机械设备有限公司（源头工厂），产品线包括：料斗、施工升降机、混凝土搅拌机/搅拌站、颚式破碎机。

你的任务：根据产品名称和规格信息，生成专业、准确的产品文案。

行业知识：
- 混凝土搅拌机系列：JZC（锥形反转出料）、JZM（摩擦传动）、强制式搅拌机
- 施工升降机系列：SC（齿轮齿条式）、SS（钢丝绳式）
- 破碎机系列：颚式破碎机（PE/PEX系列）
- 常见术语：出料容量(L)、电机功率(kw)、时产量(m³/h)、进料粒度(mm)、整机重量(吨)

写作要求：
1. 使用专业、准确的技术术语
2. 以事实和数据为核心（数字 > 形容词）
3. 中文文案面向国内工程客户，语气专业但直接
4. 英文文案面向海外采购商，使用地道的机械行业英语
5. 每段聚焦一个卖点
6. 描述（description）使用 HTML 格式，带 <p> 段落标签`;

  const userPrompt = `请为以下产品生成完整的文案内容：

产品名称：${productName}
所属分类：${categoryName}

规格信息（自然语言）：
${rawSpecs || '(未提供)'}

该产品类型的标准参数列表：
${paramList}

请以 JSON 格式返回（只返回 JSON，不要有任何其他内容）：

{
  "productName": { "zh": "中文产品名称", "en": "English product name" },
  "summary": {
    "zh": "中文简介（1-2句话，突出核心卖点和参数）",
    "en": "English summary (1-2 sentences)"
  },
  "description": {
    "zh": "中文详细描述（HTML格式，3-4段，每段用<p>包裹。包括：产品概述、技术亮点、适用场景、厂家优势）",
    "en": "English detailed description (HTML format, 3-4 paragraphs with <p> tags)"
  },
  "keywords": {
    "zh": "中文SEO关键词（逗号分隔，6-8个）",
    "en": "English SEO keywords (comma separated, 6-8)"
  },
  "specifications": {
    "${paramKeys}": "从规格信息中提取对应参数值，未提供的留空字符串"
  }
}

重要规则：
- specifications 的 key 必须与列出的标准参数完全一致
- 从原始规格文本中准确提取数值，不要编造
- 英文名称遵循机械行业命名规范
- 如果规格信息为空，specifications 所有值留空，描述侧重产品类型通用介绍`;

  return { systemPrompt, userPrompt };
}

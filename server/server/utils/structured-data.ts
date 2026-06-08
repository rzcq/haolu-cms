/**
 * GEO 结构化数据生成工具
 *
 * 为前台页面生成 Schema.org JSON-LD 结构化数据，
 * 帮助 AI 搜索引擎准确理解网站内容。
 */

export interface GeoCompanyInfo {
  name: { zh: string; en: string };
  description: { zh: string; en: string };
  address: { street: string; city: string; region: string; country: string };
  telephone: string;
  whatsapp?: string;
  email?: string;
  openingHours: string;
  areaServed: string[];
  url?: string;
}

export interface GeoFaqItem {
  q: { zh: string; en: string };
  a: { zh: string; en: string };
}

/**
 * 生成 Organization / LocalBusiness Schema
 */
export function buildOrganizationSchema(company: GeoCompanyInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: company.name.zh,
    description: company.description.zh,
    url: company.url,
    telephone: company.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.country
    },
    openingHours: company.openingHours,
    areaServed: company.areaServed
  };
}

/**
 * 生成 WebSite Schema
 */
export function buildWebSiteSchema(siteUrl: string, searchUrlTemplate: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteUrl,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrlTemplate
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * 生成 BreadcrumbList Schema
 */
export function buildBreadcrumbListSchema(
  items: Array<{ name: string; url: string }>,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };
}

/**
 * 生成 FAQPage Schema
 */
export function buildFaqPageSchema(faqs: GeoFaqItem[], locale: string = 'zh') {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q[locale as keyof typeof faq.q] || faq.q.zh,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a[locale as keyof typeof faq.a] || faq.a.zh
      }
    }))
  };
}

/**
 * 生成 Product Schema
 */
export function buildProductSchema(params: {
  name: string;
  description: string;
  image?: string;
  brandName?: string;
  manufacturerName?: string;
  specifications?: Array<{ name: string; value: string; unit?: string }>;
  url?: string;
}) {
  const properties = params.specifications?.map(spec => ({
    '@type': 'PropertyValue',
    name: spec.name,
    value: spec.value,
    ...(spec.unit ? { unitText: spec.unit } : {})
  })) || [];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: params.name,
    description: params.description,
    ...(params.image ? { image: params.image } : {}),
    ...(params.url ? { url: params.url } : {}),
    ...(params.brandName
      ? { brand: { '@type': 'Brand', name: params.brandName } }
      : {}),
    ...(params.manufacturerName
      ? {
          manufacturer: {
            '@type': 'Organization',
            name: params.manufacturerName
          }
        }
      : {}),
    ...(properties.length > 0 ? { additionalProperty: properties } : {})
  };
}

/**
 * 生成 Article Schema
 */
export function buildArticleSchema(params: {
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  publisher?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.headline,
    ...(params.description ? { description: params.description } : {}),
    ...(params.image ? { image: params.image } : {}),
    ...(params.datePublished ? { datePublished: params.datePublished } : {}),
    ...(params.dateModified ? { dateModified: params.dateModified } : {}),
    ...(params.author ? { author: { '@type': 'Person', name: params.author } } : {}),
    ...(params.publisher
      ? { publisher: { '@type': 'Organization', name: params.publisher } }
      : {}),
    ...(params.url ? { url: params.url } : {})
  };
}

/**
 * 从 category.mpath 构建面包屑项
 */
export function buildBreadcrumbsFromMpath(
  mpath: string,
  categoryMap: Record<number, string>,
  currentTitle?: string
) {
  const ids = mpath
    .split('.')
    .filter(id => id)
    .map(Number);
  const items = ids.map(id => ({
    name: categoryMap[id] || `#${id}`,
    url: '' // 由调用方根据 locale prefix 填充
  }));

  if (currentTitle) {
    items.push({ name: currentTitle, url: '' });
  }

  return items;
}

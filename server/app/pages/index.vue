<template>
  <main class="flex-grow">
    <HeroBanner />
    <PowderProcessing />
    <ConstructionEquipment />
    <!-- <GlobalSuccessStories /> -->
    <WhyChooseAndBranches />
    <RequestAQuote />
  </main>
</template>

<script setup lang="ts">
import HeroBanner from '~/components/sections/HeroBanner.vue'
import ConstructionEquipment from '~/components/sections/ConstructionEquipment.vue'
import PowderProcessing from '~/components/sections/home_product.vue'
import GlobalSuccessStories from '~/components/sections/GlobalSuccessStories.vue'
import WhyChooseAndBranches from '~/components/sections/WhyChooseAndBranches.vue'
import RequestAQuote from '~/components/sections/RequestAQuote.vue'

const { locale, locales } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const [{ t }, { data: seoData }] = await Promise.all([
  useI18nLoader(),
  useFetch('/api/public/cms/seo/get', {
    query: { pageType: 'home' },
    getCachedData: (key: string) => localCacheData(key),
  }),
])

// SEO
const seoConfig = seoData.value
const currentLocale = locale.value as 'zh' | 'en'

const getTitle = () => seoConfig?.title?.[currentLocale] || seoConfig?.title?.en || ''
const getKeywords = () => seoConfig?.keywords?.[currentLocale] || seoConfig?.keywords?.en || ''
const getDescription = () => seoConfig?.description?.[currentLocale] || seoConfig?.description?.en || ''
const getOgTitle = () => seoConfig?.ogTitle?.[currentLocale] || seoConfig?.ogTitle?.en || getTitle()
const getOgDescription = () => seoConfig?.ogDescription?.[currentLocale] || seoConfig?.ogDescription?.en || getDescription()

const config = useRuntimeConfig()
const links = computed(() => {
  return locales.value.map(l => ({
    rel: 'alternate',
    hreflang: l.language,
    href: `${config.public.serverHost}/${l.code}`,
  }))
})

useHead({
  title: getTitle(),
  meta: [
    { name: 'description', content: getDescription() },
    { name: 'keywords', content: getKeywords() },
    { property: 'og:title', content: getOgTitle() },
    { property: 'og:description', content: getOgDescription() },
    { property: 'og:image', content: seoConfig?.ogImage || '/favicon.png' },
    { property: 'og:type', content: 'website' },
  ],
  link: [
    { rel: 'canonical', href: `${config.public.serverHost}${route.path}` },
    ...links.value,
  ],
})

// GEO 结构化数据
const { data: geoData } = await useFetch('/api/public/cms/geo', {
  getCachedData: (key: string) => localCacheData(key),
})

if (geoData.value?.company) {
  const { buildOrganizationSchema, buildWebSiteSchema, buildFaqPageSchema } =
    await import('~~/server/utils/structured-data')

  const siteUrl = config.public.serverHost || ''
  const currentLang = currentLocale === 'en' ? 'en' : 'zh'

  useStructuredData([
    buildWebSiteSchema(siteUrl, `${siteUrl}/search?q={search_term_string}`),
    buildOrganizationSchema(geoData.value.company),
    ...(geoData.value.faq?.length > 0 ? [buildFaqPageSchema(geoData.value.faq, currentLang)] : [])
  ])
}
</script>

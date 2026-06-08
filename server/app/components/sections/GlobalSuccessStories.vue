<template>
  <section class="py-16 bg-white">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-6">
      <!-- 标题 + 按钮 -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl lg:text-3xl font-bold text-gray-800">{{ t('home.news.title') }}</h2>
        <nuxt-link
          :to="localePath('/news')"
          class="btn-outline"
        >{{ t('home.news.viewMore') }}</nuxt-link>
      </div>

      <!-- 案例网格：桌面4列，移动2列 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <nuxt-link
          v-for="item in newsList"
          :key="item.newsId"
          :to="newsLink(item)"
          class="group"
        >
          <div class="overflow-hidden rounded aspect-[16/9]">
            <nuxt-img
              v-if="item.coverImage"
              format="webp"
              :src="item.coverImage"
              :alt="item.title?.[locale] || item.title?.en || ''"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 class="mt-2 text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-ds-blue transition-colors">
            {{ item.title?.[locale] || item.title?.en || '' }}
          </h3>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()

const [{ t }, { data: hotData }]: any = await Promise.all([
  useI18nLoader(),
  useFetch('/api/public/cms/news/hot', {
    query: { limit: 8 },
    getCachedData: (key: string) => localCacheData(key),
  }),
])

const newsList = computed(() => hotData.value?.data || [])

function newsLink(news: any) {
  if (!news.categoryMpath || news.categoryMpath.length === 0) {
    return localePath(`/news/${news.newsId}`)
  }
  let categoryUrl = ''
  news.categoryMpath.forEach((item: any) => {
    categoryUrl += `/${item.urlKey}`
  })
  return localePath(`${categoryUrl}/${news.newsId}`)
}
</script>
